import { IWithChatRoomInfo, newWithChatRoomInfo } from '../chatRoom';
import { DeepPartial } from '../genericObject';
import { IUserLite, newUserLite } from '../genericUser';

type ThisInterface = IUserIdentificationData;
export const newUserIdentificationData = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newUserLite(object),
    ...newWithChatRoomInfo(object),
  };

  return toReturnObject;
};

export interface IUserIdentificationData extends IUserLite, IWithChatRoomInfo {}
