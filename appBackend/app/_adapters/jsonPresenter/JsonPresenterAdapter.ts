import {
  CustomError,
  CustomErrorCodes,
  IJsonPresenter,
  IJsonWebServerFramework,
  LogMessageType,
} from '../_useCases';

export class JsonPresenterAdapter implements IJsonPresenter {
  constructor(private jsonWebServerFramework: IJsonWebServerFramework) {}

  public isProduction(): boolean {
    try {
      return this.jsonWebServerFramework.isProduction();
    } catch (e) {
      throw new CustomError({
        code: CustomErrorCodes.UNKNOWN_ERROR,
        message: (e as Error).message,
        reportAsError: true,
        status: 'internal',
      });
    }
  }

  public logMessage(type: LogMessageType, ...messages: string[]): void {
    try {
      return this.jsonWebServerFramework.logMessage(type, ...messages);
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
