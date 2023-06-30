import * as functions from 'firebase-functions';
import { Application, CustomError, CustomErrorCodes } from '../../app';
import { JsonViewExpressPresenterDriver } from '../../presenterDrivers/JsonViewExpressPresenterDriver';

/**
 * Blue Layer: Frameworks & Drivers (Frameworks)
 */
export const manualTriggeredFunctions = functions.runWith({ timeoutSeconds: 540, memory: '256MB' }).https.onRequest(
  JsonViewExpressPresenterDriver.createExpressApp().post('/:method', async (request, response) => {
    const jsonViewPresenter = Application.getInstance().getJsonViewPresenter();

    const callableName = request.params.method;
    const fullCallableName = `manualTriggeredFunctions.${callableName}`;

    const executionCallback = async (data: any, _: string): Promise<object> => {
      switch (callableName) {

        default:
          throw new CustomError({
            code: CustomErrorCodes.METHOD_NOT_FOUND,
            message: 'Method Not Found.',
            payload: {
              callableName,
              fullCallableName,
            },
            status: 'invalid-argument',
          });
      }
    };

    return jsonViewPresenter.getOnRequestAsOnCall(request, response, async (data, context) =>
      jsonViewPresenter.executeIfAuthorizedAndManageErrorsIf(fullCallableName, data, context, executionCallback),
    );
  }),
);
