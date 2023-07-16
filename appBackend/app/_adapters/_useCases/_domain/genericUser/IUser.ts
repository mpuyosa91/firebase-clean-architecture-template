import { DeepPartial, IGenericObject, newGenericObject } from '../genericObject';
import { IPublicUser, newPublicUser } from './IPublicUser';
import { IWritableUser, newWritableUser } from './IWritableUser';
import { ObjectTypesEnum } from '../enums';
import { IUserLite, newUserLite } from './IUserLite';
import { IWithEmail, newWithEmail, UserRoleEnum } from '../userIdentification';

type ThisInterface = IUser;
export const newUser = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newGenericObject(object),
    ...newUserLite(object),
    ...newPublicUser(object),
    ...newWritableUser(object),
    ...newWithEmail(object),
    objectType: ObjectTypesEnum.USER,
    role: UserRoleEnum.USER,
  };

  return toReturnObject;
};

export interface IUser extends IGenericObject, IUserLite, IPublicUser, IWritableUser, IWithEmail {}
