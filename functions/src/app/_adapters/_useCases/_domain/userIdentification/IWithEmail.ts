import { DeepPartial } from '../genericObject';
import { Validator } from '../validator';

type ThisInterface = IWithEmail;

export const checkWithEmailRequest = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): ThisInterface => {
  request.emailVerified = request.emailVerified ?? false;

  request.email = Validator.validateRegex(
    { value: request.email, name: 'email', contextPath },
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );

  return {
    email: request.email,
    emailVerified: request.emailVerified,
  };
};

export const newWithEmail = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    email: object?.email ?? 'null@none.com',
    emailVerified: object?.emailVerified ?? false,
  };

  toReturnObject.email = toReturnObject.email.toLowerCase();

  return toReturnObject;
};

export interface IWithEmail {
  /**
   * @format email
   */
  email: string;

  /**
   * @default false
   */
  emailVerified: boolean;
}
