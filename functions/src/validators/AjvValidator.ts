import Ajv from 'ajv';
import { IJsvExternalInterface } from '../app/common/validator/IJsvExternalInterface';

export class AjvValidator implements IJsvExternalInterface {
  private ajv: Ajv.Ajv;

  constructor() {
    this.ajv = new Ajv({ useDefaults: true });
  }

  public async validate(
    schemaValidator: object,
    toValidateObject: any
  ): Promise<string | null> {
    const validate = this.ajv.compile(schemaValidator);
    if (!validate(toValidateObject)) {
      return this.ajv.errorsText(validate.errors);
    }
    return null;
  }
}
