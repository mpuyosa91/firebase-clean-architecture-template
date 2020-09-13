import { IJsvExternalInterface } from './IJsvExternalInterface';
import { IValidationGateway } from './IValidationGateway';

export class ValidationGateway implements IValidationGateway {
  constructor(private jsvExternalInterface: IJsvExternalInterface) {}

  public async validate(
    schemaValidator: object,
    toValidateObject: any
  ): Promise<void> {
    const validationErrorMessage = await this.jsvExternalInterface.validate(
      schemaValidator,
      toValidateObject
    );
    if (validationErrorMessage !== null) {
      throw new Error(validationErrorMessage);
    }
  }
}
