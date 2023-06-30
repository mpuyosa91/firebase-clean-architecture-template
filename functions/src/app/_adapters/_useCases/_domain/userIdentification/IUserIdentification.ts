import { DeepPartial, IIdentifiableUuid, newIdentifiableUuid, newNullable } from '../genericObject';
import { IUserIdentificationData, newUserIdentificationData } from './IUserIdentificationData';
import { IWithEmail, newWithEmail } from './IWithEmail';

type ThisInterface = IUserIdentification;
export const newUserIdentification = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newIdentifiableUuid(object),
    ...newWithEmail(object),
    data: newNullable(newUserIdentificationData, object?.data),
  };

  if (toReturnObject.data) {
    toReturnObject.data = newUserIdentificationData({
      ...toReturnObject.data,
      id: toReturnObject.id,
    });
  }

  return toReturnObject;
};

export interface IUserIdentification extends IIdentifiableUuid, IWithEmail {
  data: IUserIdentificationData | null;
}
