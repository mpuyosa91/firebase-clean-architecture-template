import { DeepPartial } from '../genericObject';
import { CustomDate } from '../customDate';
import { IUserLite, newUserLite } from '../genericUser';
import { ObjectTypesEnum } from '../enums';

type ThisInterface = IParticipant;
export const newParticipant = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newUserLite(object),
    lastSeen: object?.lastSeen ?? new CustomDate().toIsoString(),
    unreadMessages: object?.unreadMessages ?? 0,
    objectType: ObjectTypesEnum.PARTICIPANT,
  };

  return toReturnObject;
};

export interface IParticipant extends IUserLite {
  /**
   * @default 0
   */
  unreadMessages: number;

  /**
   * @pattern (\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})
   */
  lastSeen: string;
}
