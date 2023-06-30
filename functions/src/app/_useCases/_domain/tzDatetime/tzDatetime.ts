import { DeepPartial } from '../DeepPartial/DeepPartial';

export const newTzDatetimeNow = (): ITzDatetime => ({ date: new Date().toISOString() });

export const newTzDatetime = (object?: DeepPartial<ITzDatetime>): ITzDatetime => {
  const toReturnObject: ITzDatetime = {
    date: object?.date ? new Date(object?.date).toISOString() : '',
  };

  return toReturnObject;
};

export interface ITzDatetime {
  /**
   * @pattern (\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3,6})Z
   * @default 9999-01-01T00:00:00.000Z
   */
  date: string;
}
