import { faker } from '@faker-js/faker';
import { DeepPartial } from './DeepPartial';

type ThisInterface = IWritablePublicGenericObject;
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
