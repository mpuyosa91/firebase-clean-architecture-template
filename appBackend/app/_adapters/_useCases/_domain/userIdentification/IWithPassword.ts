import { DeepPartial } from '../genericObject';
import { Validator } from '../validator';
import { faker } from '@faker-js/faker';

type ThisInterface = IWithPassword;

export const checkNonStrictWithPassword = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): DeepPartial<ThisInterface> => {
  if (request.pass) {
    request.pass = Validator.validateLength(
      { value: request.pass, name: 'pass', contextPath },
      { max: 32, min: 8 }
    );
  }

  return request;
};

export const checkWithPassword = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): ThisInterface => {
  request.pass = Validator.validateExistence({ value: request.pass, name: 'pass', contextPath });

  return newWithPassword(checkNonStrictWithPassword(request, contextPath));
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

export const newFakeWithPassword = (): ThisInterface => {
  return newWithPassword({
    pass: faker.internet.password({ length: 10 }),
  });
};
