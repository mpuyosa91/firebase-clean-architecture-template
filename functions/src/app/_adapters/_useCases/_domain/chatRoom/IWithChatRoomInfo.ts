import { DeepPartial } from '../genericObject';

type ThisInterface = IWithChatRoomInfo;
export const newWithChatRoomInfo = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    lastChatRoomId: object?.lastChatRoomId ?? null,
    totalUnreadMessages: object?.totalUnreadMessages ?? 0,
  };

  return toReturnObject;
};

export interface IWithChatRoomInfo {
  /**
   * @default 0
   */
  totalUnreadMessages: number;

  /**
   * @default null
   */
  lastChatRoomId: string | null;
}
