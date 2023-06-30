import {
  CustomError,
  CustomErrorCodes,
  IJsonViewPresenter,
  IJsonViewPresenterDriver,
} from '../_adapters';

export class JsonViewPresenterAdapter implements IJsonViewPresenter {
  constructor(private jsonViewPresenterDriver: IJsonViewPresenterDriver) {}

  public async getOnRequestAsOnCall(
    request: unknown,
    response: unknown,
    callback: (data: object, context: object) => Promise<object>
  ): Promise<object> {
    try {
      return await this.jsonViewPresenterDriver.getOnRequestAsOnCall(
        request,
        response,
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

  public async executeIfAuthorizedAndManageErrorsIf(
    functionName: string,
    data: object,
    context: object,
    callback: (data: object, user: string) => Promise<object>
  ): Promise<object> {
    try {
      return await this.jsonViewPresenterDriver.executeIfAuthorizedAndManageErrorsIf(
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
}
