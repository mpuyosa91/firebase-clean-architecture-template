import { DeepPartial } from '../genericObject';
import { Validator } from '../validator';
import { faker } from '@faker-js/faker';

type ThisInterface = IWithEmail;

export const checkNonStrictWithEmail = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): DeepPartial<ThisInterface> => {
  if (request.email) {
    request.email = Validator.validateRegex(
      { value: request.email, name: 'email', contextPath },
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );
  }

  return request;
};

export const checkWithEmail = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): ThisInterface => {
  request.emailVerified = request.emailVerified ?? false;

  request.email = Validator.validateExistence({ value: request.email, name: 'email', contextPath });

  return newWithEmail(checkNonStrictWithEmail(request, contextPath));
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

export const newFakeWithEmail = (): ThisInterface => {
  return newWithEmail({
    email: faker.internet.email(),
  });
};
