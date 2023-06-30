import { DeepPartial } from './DeepPartial';
import { IIdentifiableUuid, newIdentifiableUuid } from './IIdentifiableUuid';
import { ObjectTypesEnum } from '../enums';

type ThisInterface = IGenericObjectLite;
export const newGenericObjectLite = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newIdentifiableUuid(object),
    displayName: object?.displayName ?? '',
    objectType: ObjectTypesEnum.GENERIC_OBJECT_LITE,
  };

  return toReturnObject;
};

export interface IGenericObjectLite extends IIdentifiableUuid {
  /**
   * @default ""
   */
  displayName: string; // IPublicGenericObject

  /**
   * @default NONE
   */
  objectType: ObjectTypesEnum; // IPublicGenericObject
}
