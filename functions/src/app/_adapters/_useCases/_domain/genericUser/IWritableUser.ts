import {
  IWritablePublicUser,
  newFakeWritablePublicUser,
  newWritablePublicUser,
} from './IWritablePublicUser';
import {
  DeepPartial,
  IWritableGenericObject,
  newFakeWritableGenericObject,
  newWritableGenericObject,
} from '../genericObject';

type ThisInterface = IWritableUser;
export const newWritableUser = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newWritableGenericObject(object),
    ...newWritablePublicUser(object),
  };

  return toReturnObject;
};

export interface IWritableUser extends IWritableGenericObject, IWritablePublicUser {}

export const newFakeWritableUser = (params: { withAvatar?: boolean } = {}): ThisInterface => {
  return newWritableUser({
    ...newFakeWritableGenericObject(params),
    ...newFakeWritablePublicUser(params),
  });
};
