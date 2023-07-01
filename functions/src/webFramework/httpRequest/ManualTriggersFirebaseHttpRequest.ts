import * as functions from 'firebase-functions';
import { Application, ControllerFunction, CustomError, CustomErrorCodes } from '../../app';
import { ExpressJsonWebServerFramework } from '../../jsonPresenter/ExpressJsonWebServerFramework';

/**
 * Blue Layer: Frameworks & Drivers (Frameworks)
 */
export const manualTriggeredFunctions = functions
  .runWith({ timeoutSeconds: 540, memory: '256MB' })
  .https.onRequest(
    ExpressJsonWebServerFramework.createExpressApp().post('/:method', async (request, response) => {
      const jsonViewPresenter = Application.getInstance().getJsonViewPresenter();
      const genericUserController = Application.getInstance().getGenericUserController();

      const callableName = request.params.method;
      const fullCallableName = `manualTriggeredFunctions.${callableName}`;

      const executionCallback: ControllerFunction = async (data, userId): Promise<object> => {
        switch (callableName) {
          case 'onWriteUser':
            return genericUserController.onWriteUser(data, userId);

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
        jsonViewPresenter.executeIfAuthorizedAndManageErrorsIf(
          fullCallableName,
          data,
          context,
          executionCallback
        )
      );
    })
  );
