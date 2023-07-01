import { DeepPartial, IGenericObject, newGenericObject } from '../genericObject';
import { ObjectTypesEnum } from '../enums';

type ThisInterface = IMessage;
export const newMessage = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newGenericObject(object),
    content: object?.content ?? '',
    objectType: ObjectTypesEnum.MESSAGE,
    senderId: object?.senderId ?? '',
  };

  return toReturnObject;
};

export interface IMessage extends IGenericObject {
  senderId: string;

  content: string;
}
