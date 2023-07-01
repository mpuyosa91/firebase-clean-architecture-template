import { DeepPartial, IPublicGenericObject, newPublicGenericObject } from '../genericObject';
import { IWritablePublicUser, newWritablePublicUser } from './IWritablePublicUser';
import { ObjectTypesEnum } from '../enums';
import { UserRoleEnum } from '../userIdentification';

type ThisInterface = IPublicUser;
export const newPublicUser = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newPublicGenericObject(object),
    ...newWritablePublicUser(object),
    objectType: ObjectTypesEnum.PUBLIC_USER,
    role: object?.role ?? UserRoleEnum.NONE,
    thumbnailUrl: object?.thumbnailUrl ?? '',
  };

  toReturnObject.displayName = `${toReturnObject.firstName} ${toReturnObject.lastName}`;

  toReturnObject.thumbnailUrl = toReturnObject.avatarUrl ?? '';

  return toReturnObject;
};

export interface IPublicUser extends IPublicGenericObject, IWritablePublicUser {
  /**
   * @default ''
   */
  thumbnailUrl: string;

  /**
   * @default NONE
   */
  role: UserRoleEnum;
}
