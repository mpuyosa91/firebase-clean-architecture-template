// noinspection ExceptionCaughtLocallyJS

import {
  CustomError,
  CustomErrorCodes,
  IController,
  IJsonWebServerFramework,
  IReportable,
  newUserIdentification,
  sortObject,
} from 'appbackend';

import cors from 'cors';
import express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as serviceAccount from '.././serviceAccountKey.json';
import { UserRecord } from 'firebase-functions/v1/auth';

const adminApp = admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
    projectId: serviceAccount.project_id,
  }),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  storageBucket: `${serviceAccount.project_id}.appspot.com`,
});

export type ExecutionCallback = (
  data: Record<string, object | string | null>,
  userId: string
) => Promise<object>;

export class FirebaseCloudFunctionsHelper implements IJsonWebServerFramework {
  private static instance: FirebaseCloudFunctionsHelper;

  private readonly isProductionState = serviceAccount.project_id === 'myapp-prd';
  public readonly firestoreDB: admin.firestore.Firestore = adminApp.firestore();
  public readonly realtimeDB: admin.database.Database = adminApp.database();
  public readonly firebaseAuth: admin.auth.Auth = adminApp.auth();
  public readonly firebaseStorage: admin.storage.Storage = adminApp.storage();

  public static getInstance(): FirebaseCloudFunctionsHelper {
    if (!FirebaseCloudFunctionsHelper.instance) {
      FirebaseCloudFunctionsHelper.instance = new FirebaseCloudFunctionsHelper();
    }

    return FirebaseCloudFunctionsHelper.instance;
  }

  public isProduction(): boolean {
    return this.isProductionState;
  }

  public generateHttpsOnRequest(
    runtimeOptions: functions.RuntimeOptions,
    controller: IController
  ): functions.HttpsFunction {
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
          const allowedDomains = ['myapp.com'];

          if (
            (serviceAccount.project_id === 'test-dev' && origin?.includes('test-dev')) ||
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

    return functions
      .runWith(runtimeOptions)
      .https.onRequest(
        app.post('/:method', (request, response) =>
          this.executeOnRequest(request, response, this.getExecutionCallback(controller))
        )
      );
  }

  public generateOnCall(
    runtimeOptions: functions.RuntimeOptions,
    controller: IController
  ): functions.HttpsFunction & functions.Runnable<object> {
    return functions.runWith(runtimeOptions).https.onCall((data, context) => {
      return this.executeOnCall(data, context, this.getExecutionCallback(controller, true));
    });
  }

  public generateUserOnCreate(controller: IController): functions.CloudFunction<UserRecord> {
    return functions.auth.user().onCreate(async (user, context) => {
      const executionCallback = this.getExecutionCallback(controller, true);

      return executionCallback(
        {
          method: 'onCreateUser',
          user: newUserIdentification({
            data: user.customClaims,
            email: user.email,
            emailVerified: user.emailVerified,
            id: user.uid,
          }),
          userId: context.auth?.uid ?? '',
        },
        'CloudFirestoreTrigger'
      );
    });
  }

  public generateUserOnDelete(controller: IController): functions.CloudFunction<UserRecord> {
    return functions.auth.user().onDelete(async (user, context) => {
      const executionCallback = this.getExecutionCallback(controller, true);

      return executionCallback(
        {
          method: 'onDeleteUser',
          user: newUserIdentification({
            data: user.customClaims,
            email: user.email,
            emailVerified: user.emailVerified,
            id: user.uid,
          }),
          userId: context.auth?.uid ?? '',
        },
        'CloudFirestoreTrigger'
      );
    });
  }

  public generateOnWrite(
    documentPath: string,
    controller: IController
  ): functions.CloudFunction<functions.Change<functions.firestore.DocumentSnapshot>> {
    return functions.firestore.document(documentPath).onWrite(async (snap, context) => {
      const executionCallback = this.getExecutionCallback(controller, true);

      return executionCallback(
        {
          method: 'onWriteObject',
          objectAfter: snap.after.exists ? (snap.after.data() as object) : null,
          objectBefore: snap.before.exists ? (snap.before.data() as object) : null,
          objectId: context.params.objectId,
        },
        'CloudFirestoreTrigger'
      );
    });
  }

  public logMessage(type: 'debug' | 'warning' | 'error' | 'info', ...messages: string[]) {
    switch (type) {
      case 'debug':
        functions.logger.debug(messages);
        break;
      case 'warning':
        functions.logger.warn(messages);
        break;
      case 'error':
        functions.logger.error(messages);
        break;
      default:
        functions.logger.info(messages);
    }
  }

  private async executeOnRequest(
    request: express.Request,
    response: express.Response,
    executionCallback: ExecutionCallback
  ): Promise<express.Response> {
    const data = {
      ...(request.body.data ?? request.body),
      method: request.params.method ?? '',
    };
    const context = await this.getContext(request);

    const result = await this.executeOnCall(data, context, executionCallback);

    if (result instanceof Error) {
      if (result instanceof functions.https.HttpsError) {
        response.status(result.httpErrorCode.status);
      } else if (result instanceof CustomError) {
        response.status(result.statusCode);
      } else {
        response.status(500);
      }
      return response.send({ error: sortObject(result) });
    }

    return response.send({ result: sortObject(result) });
  }

  private async getContext(request: express.Request): Promise<functions.https.CallableContext> {
    const context: functions.https.CallableContext = {
      rawRequest: request as functions.https.Request,
    };
    context.rawRequest.rawBody = Buffer.alloc(0);

    const rawJwt =
      request.headers.authorization?.split(' ')[0] === 'Bearer'
        ? request.headers.authorization.split(' ')[1]
        : null;

    if (!rawJwt) {
      return context;
    }

    let jwtPayload;
    try {
      jwtPayload = (await import('jsonwebtoken')).decode(rawJwt, { complete: true });

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

      return context;
    } catch (e) {
      return context;
    }
  }

  private async executeOnCall(
    data: Record<string, object | string>,
    context: functions.https.CallableContext,
    executionCallback: ExecutionCallback
  ): Promise<object> {
    const userId = context.auth?.uid ?? 'anon_user_id';

    return executionCallback(data, userId);
  }

  private getExecutionCallback =
    (controller: IController, throwError = false): ExecutionCallback =>
    async (data, userId) => {
      const startTime = new Date();

      const controllerName = controller.constructor.name;
      const methodName: keyof IController = (data.method ?? '') as string;

      let result: object | Error;
      let withError = true;
      try {
        this.logMessage(
          'debug',
          `Function: ${controllerName}.${methodName}. By: ${userId}. REQUEST_BODY:`,
          JSON.stringify(data)
        );

        if (!methodName) {
          throw new CustomError({
            code: CustomErrorCodes.METHOD_NOT_PROVIDED,
            message: 'Method Not Provided.',
            status: 'invalid-argument',
          });
        }

        if (!(methodName in controller) || typeof controller[methodName] !== 'function') {
          throw new CustomError({
            code: CustomErrorCodes.METHOD_NOT_FOUND,
            message: 'Method Not Found.',
            status: 'invalid-argument',
          });
        }

        // ***** Execution *****
        result = await controller[methodName](data, userId ?? '');
        // ***** Execution *****

        withError = false;
      } catch (e) {
        result = this.manageErrors(e as Error, throwError);
      }

      const resolution = withError ? 'with failure' : 'successfully';
      const diffTime = new Date().getTime() - startTime.getTime();
      this.logMessage(
        'debug',
        `Function: ${controllerName}.${methodName} has ran ${resolution}. In ${diffTime} mSecs`
      );

      return result;
    };

  private manageErrors(e: Error | CustomError | functions.https.HttpsError, throwError = false) {
    if ((e as CustomError).reportAsError ?? true) {
      this.logMessage('error', e.message);
    } else {
      this.logMessage('warning', e.message);
    }

    let finalE: functions.https.HttpsError;
    if (e instanceof functions.https.HttpsError) {
      finalE = new functions.https.HttpsError(e.code, e.message, e);
    } else if (e instanceof CustomError) {
      finalE = new functions.https.HttpsError(e.status, e.message, e);
    } else {
      const cE = new CustomError(e as unknown as IReportable);
      finalE = new functions.https.HttpsError(cE.status, cE.message, cE);
    }

    if (throwError) {
      throw finalE;
    }

    return finalE;
  }
}
