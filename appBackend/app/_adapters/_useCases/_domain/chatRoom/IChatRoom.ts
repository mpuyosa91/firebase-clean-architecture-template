import {
  DeepPartial,
  IGenericObjectBasic,
  newGenericObjectBasic,
  newNullable,
  newObject,
} from '../genericObject';
import { ObjectTypesEnum } from '../enums';
import { IParticipant, newParticipant } from './IParticipant';
import { IMessage, newMessage } from './IMessage';

type ThisInterface = IChatRoom;
export const newChatRoom = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newGenericObjectBasic(object),
    lastMessage: newNullable(newMessage, object?.lastMessage),
    objectType: ObjectTypesEnum.CHAT_ROOM,
    participants: newObject(object?.participants, newParticipant),
  };

  const participantsDisplayNameList = Object.values(toReturnObject.participants).map(
    (participant) => participant.displayName
  );

  toReturnObject.description =
    'ChatRoom for participants <' + participantsDisplayNameList.join('>, <') + '>';

  return toReturnObject;
};

export interface IChatRoom extends IGenericObjectBasic {
  /**
   * @default {}
   */
  participants: Record<string, IParticipant>;

  /**
   * @nullable
   */
  lastMessage: IMessage | null;
}
