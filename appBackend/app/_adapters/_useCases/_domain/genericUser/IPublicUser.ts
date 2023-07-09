import {
  DeepPartial,
  IPublicGenericObject,
  newArray,
  newPublicGenericObject,
} from '../genericObject';
import { IWritablePublicUser, newWritablePublicUser } from './IWritablePublicUser';
import { ObjectTypesEnum } from '../enums';
import { UserRoleEnum } from '../userIdentification';
import _ from 'lodash';

type ThisInterface = IPublicUser;
export const newPublicUser = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newPublicGenericObject(object),
    ...newWritablePublicUser(object),
    givenRoles: newArray(object?.givenRoles),
    objectType: ObjectTypesEnum.PUBLIC_USER,
    role: object?.role ?? UserRoleEnum.NONE,
    thumbnailUrl: object?.thumbnailUrl ?? '',
  };

  toReturnObject.displayName = `${toReturnObject.firstName} ${toReturnObject.lastName}`;

  toReturnObject.thumbnailUrl = toReturnObject.avatarUrl ?? '';

  toReturnObject.givenRoles = _.uniq(toReturnObject.givenRoles.concat(toReturnObject.role));

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

  /**
   * @default []
   */
  givenRoles: string[];
}
