import {
  CallableContextFunction,
  ControllerFunction,
  CustomError,
  CustomErrorCodes,
  IJsonPresenter,
  IJsonWebServerFramework,
} from '../_useCases';

export class JsonPresenterAdapter implements IJsonPresenter {
  constructor(private jsonWebServerFramework: IJsonWebServerFramework) {}

  public async getOnRequestAsOnCall(
    request: unknown,
    response: unknown,
    callback: CallableContextFunction
  ): Promise<object> {
    try {
      return await this.jsonWebServerFramework.getOnRequestAsOnCall(request, response, callback);
    } catch (e) {
      throw new CustomError({
        code: CustomErrorCodes.UNKNOWN_ERROR,
        message: (e as Error).message,
        reportAsError: true,
        status: 'internal',
      });
    }
  }

  public async executeIfAuthorizedAndManageErrorsIf(
    functionName: string,
    data: object,
    context: object,
    callback: ControllerFunction
  ): Promise<object> {
    try {
      return await this.jsonWebServerFramework.executeIfAuthorizedAndManageErrorsIf(
        functionName,
        data,
        context,
        callback
      );
    } catch (e) {
      throw new CustomError({
        code: CustomErrorCodes.UNKNOWN_ERROR,
        message: (e as Error).message,
        reportAsError: true,
        status: 'internal',
      });
    }
  }

  public async jsonOrErrorResponse(
    functionName: string,
    data: object,
    callback: ControllerFunction
  ): Promise<object> {
    try {
      return await this.jsonWebServerFramework.jsonOrErrorResponse(functionName, data, callback);
    } catch (e) {
      throw new CustomError({
        code: CustomErrorCodes.UNKNOWN_ERROR,
        message: (e as Error).message,
        reportAsError: true,
        status: 'internal',
      });
    }
  }
}
