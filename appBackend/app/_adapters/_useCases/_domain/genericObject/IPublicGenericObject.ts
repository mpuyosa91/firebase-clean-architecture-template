import { DeepPartial } from './DeepPartial';
import { IIdentifiableUuid, newIdentifiableUuid } from './IIdentifiableUuid';
import {
  IWritablePublicGenericObject,
  newWritablePublicGenericObject,
} from './IWritablePublicGenericObject';
import { ObjectTypesEnum } from '../enums';
import { CustomDate } from '../customDate';

type ThisInterface = IPublicGenericObject;
export const newPublicGenericObject = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newIdentifiableUuid(object),
    ...newWritablePublicGenericObject(object),
    createdAt: (object?.createdAt
      ? new CustomDate(object?.createdAt)
      : new CustomDate()
    ).toIsoString(),
    displayName: object?.displayName ?? '',
    enabled: object?.enabled ?? true,
    objectType: ObjectTypesEnum.PUBLIC_GENERIC_OBJECT,
  };

  return toReturnObject;
};

export interface IPublicGenericObject extends IIdentifiableUuid, IWritablePublicGenericObject {
  /**
   * @default NONE
   */
  objectType: ObjectTypesEnum;

  /**
   * @pattern (\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})
   * @default 1970-01-01T00:00:00+00:00
   */
  createdAt: string;

  /**
   * @default true
   */
  enabled: boolean;

  /**
   * @default ""
   */
  displayName: string;
}
