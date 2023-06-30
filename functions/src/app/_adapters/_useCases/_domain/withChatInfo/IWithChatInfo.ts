import { DeepPartial } from '../genericObject';

type ThisInterface = IWithChatInfo;
export const newChateable = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    lastChatRoomId: object?.lastChatRoomId ?? null,
    profilePictureThumbnail: object?.profilePictureThumbnail ?? null,
    totalUnreadMessages: object?.totalUnreadMessages ?? 0,
  };

  return toReturnObject;
};

export interface IWithChatInfo {
  /**
   * @default null
   */
  profilePictureThumbnail: string | null;

  /**
   * @default 0
   */
  totalUnreadMessages: number;

  /**
   * @default null
   */
  lastChatRoomId: string | null;
}
