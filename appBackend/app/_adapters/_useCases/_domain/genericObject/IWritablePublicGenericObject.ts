import { faker } from '@faker-js/faker';
import { DeepPartial } from './DeepPartial';
import { Validator } from '../validator';

type ThisInterface = IWritablePublicGenericObject;

export const checkNonStrictWritablePublicGenericObject = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): DeepPartial<ThisInterface> => {
  if (request.description) {
    request.description = Validator.validateLength(
      { value: request.description, name: 'description', contextPath },
      { max: 500 }
    );
  }

  return request;
};

export const checkWritablePublicGenericObject = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): ThisInterface => {
  request.description = Validator.validateExistence({
    value: request.description,
    name: 'description',
    contextPath,
  });

  return newWritablePublicGenericObject(
    checkNonStrictWritablePublicGenericObject(request, contextPath)
  );
};

export const newWritablePublicGenericObject = (
  object?: DeepPartial<ThisInterface>
): ThisInterface => {
  const toReturnObject: ThisInterface = {
    description: object?.description ?? '',
  };

  toReturnObject.description = toReturnObject.description.slice(0, 500);

  return toReturnObject;
};

export interface IWritablePublicGenericObject {
  /**
   * @default ""
   * @maxLength 500
   */
  description: string;
}

export const newFakeWritablePublicGenericObject = (): ThisInterface => {
  return newWritablePublicGenericObject({
    description: faker.lorem.lines(),
  });
};
