import { DeepPartial, IPublicGenericObject, newPublicGenericObject } from '../genericObject';
import { IWritablePublicUser, newWritablePublicUser } from './IWritablePublicUser';
import { ObjectTypesEnum } from '../enums';
import { UserRoleEnum } from '../userIdentification';
import { IWithRole, newWithRole } from './IWithRole';

type ThisInterface = IPublicUser;
export const newPublicUser = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newPublicGenericObject(object),
    ...newWritablePublicUser(object),
    ...newWithRole(object),
    objectType: ObjectTypesEnum.PUBLIC_USER,
    role: object?.role ?? UserRoleEnum.USER,
    thumbnailUrl: object?.thumbnailUrl ?? '',
  };

  toReturnObject.displayName = `${toReturnObject.firstName} ${toReturnObject.lastName}`;

  toReturnObject.thumbnailUrl = toReturnObject.avatarUrl ?? '';

  return toReturnObject;
};

export interface IPublicUser extends IPublicGenericObject, IWritablePublicUser, IWithRole {
  /**
   * @default ''
   */
  thumbnailUrl: string;
}
