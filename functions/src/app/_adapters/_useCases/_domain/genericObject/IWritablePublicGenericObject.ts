import { faker } from '@faker-js/faker';
import { DeepPartial } from './DeepPartial';
import { Validator } from '../validator';

type ThisInterface = IWritablePublicGenericObject;

export const checkWritablePublicGenericObjectRequest = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): ThisInterface => {
  request.description = request.description ?? '';

  Validator.validateLength(
    { value: request.description, name: 'description', contextPath },
    { max: 500 }
  );

  return {
    description: request.description,
  };
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
