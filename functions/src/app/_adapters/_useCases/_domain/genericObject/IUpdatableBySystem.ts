import { DeepPartial } from './DeepPartial';
import { CustomDate } from '../customDate';

type ThisInterface = IUpdatableBySystem;
export const newUpdatableBySystem = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    updatedAtBySystem: new CustomDate(object?.updatedAtBySystem ?? '').toIsoString(),
    updatedAtBySystemTimestamp: object?.updatedAtBySystemTimestamp ?? 0,
  };

  toReturnObject.updatedAtBySystemTimestamp = new CustomDate(
    toReturnObject.updatedAtBySystem
  ).getTime();

  return toReturnObject;
};

export interface IUpdatableBySystem {
  /**
   * @pattern (\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})
   * @default 1970-01-01T00:00:00+00:00
   */
  updatedAtBySystem: string;

  /**
   * @default 0
   */
  updatedAtBySystemTimestamp: number;
}
