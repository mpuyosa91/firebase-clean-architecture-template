import { IPublicGenericObject, newPublicGenericObject } from './IPublicGenericObject';
import { DeepPartial } from './DeepPartial';
import { CustomDate } from '../customDate';
import { ObjectTypesEnum } from '../enums';
import { newNullable } from './Nullable';
import { IUpdatableBySystem, newUpdatableBySystem } from './IUpdatableBySystem';

type ThisInterface = IGenericObjectBasic;
export const newGenericObjectBasic = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newPublicGenericObject(object),
    ...newUpdatableBySystem(object),
    createdAtTimestamp: 0,
    deletedAt: newNullable((value) => new CustomDate(value ?? '').toIsoString(), object?.deletedAt),
    objectType: ObjectTypesEnum.GENERIC_OBJECT_BASIC,
  };

  toReturnObject.createdAtTimestamp = new CustomDate(toReturnObject.createdAt).getTime();

  toReturnObject.enabled = toReturnObject.deletedAt !== null;

  return toReturnObject;
};

export interface IGenericObjectBasic extends IPublicGenericObject, IUpdatableBySystem {
  /**
   * @default null
   * @pattern (\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})
   */
  deletedAt: string | null;

  /**
   * @default 0
   */
  createdAtTimestamp: number;
}
