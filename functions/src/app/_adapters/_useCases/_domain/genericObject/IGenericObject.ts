import { DeepPartial } from './DeepPartial';
import { ObjectTypesEnum } from '../enums';
import { IWritableGenericObject, newWritableGenericObject } from './IWritableGenericObject';
import { IGenericObjectLite, newGenericObjectLite } from './IGenericObjectLite';
import { CustomDate } from '../customDate';
import { IGenericObjectBasic, newGenericObjectBasic } from './IGenericObjectBasic';

type ThisInterface = IGenericObject;
export const newGenericObject = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newGenericObjectLite(object),
    ...newGenericObjectBasic(object),
    ...newWritableGenericObject(object),
    objectType: ObjectTypesEnum.GENERIC_OBJECT,
    updatedAt: new CustomDate(object?.updatedAtBySystem ?? '').toIsoString(),
  };

  return toReturnObject;
};

export interface IGenericObject
  extends IGenericObjectLite,
    IGenericObjectBasic,
    IWritableGenericObject {
  /**
   * @pattern (\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})
   * @default 1970-01-01T00:00:00+00:00
   */
  updatedAt: string;
}
