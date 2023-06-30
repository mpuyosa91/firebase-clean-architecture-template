import { IPublicGenericObject, newPublicGenericObject } from './IPublicGenericObject';
import { DeepPartial } from './DeepPartial';
import { CustomDate } from '../customDate';
import { ObjectTypesEnum } from '../enums';
import { newNullable } from './Nullable';

type ThisInterface = IGenericObjectBasic;
export const newGenericObjectBasic = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newPublicGenericObject(object),
    createdAtEpoch: 0,
    deletedAt: newNullable((value) => new CustomDate(value ?? '').toIsoString(), object?.deletedAt),
    objectType: ObjectTypesEnum.GENERIC_OBJECT_BASIC,
    updatedAtBySystem: new CustomDate(object?.updatedAtBySystem ?? '').toIsoString(),
  };

  toReturnObject.createdAtEpoch = new CustomDate(toReturnObject.createdAt).getTime();

  toReturnObject.enabled = toReturnObject.deletedAt !== null;

  return toReturnObject;
};

export interface IGenericObjectBasic extends IPublicGenericObject {
  /**
   * @pattern (\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})
   * @default 1970-01-01T00:00:00+00:00
   */
  updatedAtBySystem: string;

  /**
   * @default null
   * @pattern (\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})
   */
  deletedAt: string | null;

  /**
   * @default 0
   */
  createdAtEpoch: number;
}
