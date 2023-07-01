import cors from 'cors';
import express from 'express';
import * as functions from 'firebase-functions';
import { getServiceAccount } from '../firebase';
import {
  CallableContextFunction,
  ControllerFunction,
  CustomError,
  CustomErrorCodes,
  IJsonWebServerFramework,
  IReportable,
  sortObject,
} from '../app';

export class ExpressJsonWebServerFramework implements IJsonWebServerFramework {
  public static throwable = true;

  public static createExpressApp() {
    const allowedHeaders = [
      'Authorization',
      'Origin',
      'Content-Type',
      'Accept',
      'Access-Control-Allow-Request-Method',
      'Access-Control-Allow-Origin',
    ];
    const allowedMethods = ['OPTIONS', 'POST'];

    const app = express();
    app.set('json spaces', 2);
    app.use(
      cors({
        allowedHeaders,
        methods: allowedMethods,
        origin: async (origin, callback) => {
          const serviceAccountSource = await getServiceAccount();

          const allowedDomains = ['myapp.com'];

          if (
            (serviceAccountSource.project_id === 'test-dev' && origin?.includes('test-dev')) ||
            origin?.includes('localhost')
          ) {
            allowedDomains.push(origin);
          }

          callback(null, allowedDomains);
        },
      })
    );
    app.use((req, res, next) => {
      const origin = req.get('origin');

      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', allowedMethods.join(','));
      res.header('Access-Control-Allow-Headers', allowedHeaders.join(','));

      next();
    });
    return app;
  }

  public static async manageErrors(
    e: functions.https.HttpsError | CustomError | Error | unknown
  ): Promise<Error> {
    let finalE: functions.https.HttpsError;

    if (e instanceof functions.https.HttpsError) {
      finalE = new functions.https.HttpsError(e.code, e.message, e);
    } else if (e instanceof CustomError) {
      finalE = new functions.https.HttpsError(e.status, e.message, e);
    } else {
      const cE = new CustomError(e as IReportable);
      finalE = new functions.https.HttpsError(cE.status, cE.message, cE);
    }

    if (this.throwable) {
      throw finalE;
    }

    return finalE;
  }

  private static async reportFailedTermination(
    callableName: string,
    startTime: Date,
    e: Error | CustomError
  ) {
    let isError = true;
    if (e instanceof CustomError) {
      isError = e.reportAsError;
    }

    if (isError) {
      functions.logger.error(e.message);
    } else {
      functions.logger.warn(e.message);
    }

    const diffTime = new Date().getTime() - startTime.getTime();
    functions.logger.debug(`Callable: ${callableName} has ran with failure. In ${diffTime} mSecs`);
  }

  private static async reportSuccessfulTermination(callableName: string, startTime: Date) {
    const diffTime = new Date().getTime() - startTime.getTime();
    functions.logger.debug(`Callable: ${callableName} has ran successfully. In ${diffTime} mSecs`);
  }

  public async getOnRequestAsOnCall(
    request: express.Request,
    response: express.Response,
    callback: CallableContextFunction
  ): Promise<express.Response> {
    const data = request.body.data || request.body;

    const context: functions.https.CallableContext = {
      rawRequest: request as functions.https.Request,
    };
    context.rawRequest.rawBody = Buffer.alloc(0);

    function getRawJwt() {
      if (
        request.headers.authorization &&
        request.headers.authorization.split(' ')[0] === 'Bearer'
      ) {
        return request.headers.authorization.split(' ')[1];
      }
      return null;
    }

    let rawJwt = getRawJwt();

    if (rawJwt) {
      let jwtPayload;
      try {
        jwtPayload = (await import('jsonwebtoken')).decode(rawJwt, {
          complete: true,
        });
        if (
          jwtPayload !== null &&
          typeof jwtPayload !== 'string' &&
          typeof jwtPayload.payload !== 'string'
        ) {
          context.auth = {
            uid: jwtPayload.payload.user_id,
            token: jwtPayload.payload,
          } as functions.https.CallableContext['auth'];
        }
      } catch (e) {
        rawJwt = null;
      }
    }

    ExpressJsonWebServerFramework.throwable = false;
    const result = await callback(data, context);
    ExpressJsonWebServerFramework.throwable = true;

    if (result instanceof Error) {
      if (result instanceof functions.https.HttpsError) {
        response.status(result.httpErrorCode.status);
      } else {
        response.status(500);
      }
      return response.send({ error: sortObject(result) });
    }

    return response.send({ result: sortObject(result) });
  }

  public async executeIfAuthorizedAndManageErrorsIf(
    functionName: string,
    data: object,
    context: functions.https.CallableContext,
    callback: ControllerFunction
  ): Promise<object | Error> {
    return this.jsonOrErrorResponse(functionName, data, (_, __) => {
      const user = context.auth;
      if (!user) {
        throw new CustomError({
          code: CustomErrorCodes.NOT_LOGGED_IN,
          message: 'Please, log in first.',
          status: 'unauthenticated',
        });
      }

      functions.logger.log(
        `REQUEST_BODY - ${functionName}. By: ${user.uid}.`,
        JSON.stringify(data)
      );

      return callback(data, user.uid);
    });
  }

  public async jsonOrErrorResponse(
    functionName: string,
    data: object,
    callback: ControllerFunction
  ): Promise<object | Error> {
    const begin = new Date();
    try {
      const result = await callback(data, 'systemUserCall');

      await ExpressJsonWebServerFramework.reportSuccessfulTermination(functionName, begin);

      return result;
    } catch (e) {
      await ExpressJsonWebServerFramework.reportFailedTermination(functionName, begin, e as Error);

      return ExpressJsonWebServerFramework.manageErrors(e);
    }
  }
}
