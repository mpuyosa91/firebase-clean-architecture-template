import { DeepPartial } from '../genericObject';
import { Validator } from '../validator';

type ThisInterface = IWithPassword;

export const checkWithPasswordRequest = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): ThisInterface => {
  Validator.validateExistence({ value: request.pass, name: 'pass', contextPath });

  return newWithPassword(request);
};

export const newWithPassword = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    pass: object?.pass ?? '',
  };

  return toReturnObject;
};

export interface IWithPassword {
  /**
   * @minLength 8
   * @maxLength 32
   */
  pass: string;
}
