import { DeepPartial, IGenericObjectLite, newGenericObjectLite } from '../genericObject';
import { ObjectTypesEnum } from '../enums';
import { UserRoleEnum } from '../userIdentification';

type ThisInterface = IUserLite;
export const newUserLite = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newGenericObjectLite(object),
    firstName: object?.firstName ?? '',
    lastName: object?.lastName ?? '',
    mainLanguage: object?.mainLanguage ?? 'en',
    objectType: ObjectTypesEnum.USER_LITE,
    role: object?.role ?? UserRoleEnum.NONE,
    thumbnailUrl: object?.thumbnailUrl ?? '',
  };

  toReturnObject.displayName = `${toReturnObject.firstName} ${toReturnObject.lastName}`;

  return toReturnObject;
};

export interface IUserLite extends IGenericObjectLite {
  /**
   * @default ''
   */
  thumbnailUrl: string; // IPublicUser

  /**
   * @default NONE
   */
  role: UserRoleEnum; // IPublicUser

  /**
   * @minLength 2
   * @maxLength 100
   */
  firstName: string; // IWritablePublicUser

  /**
   * @minLength 2
   * @maxLength 100
   */
  lastName: string; // IWritablePublicUser

  /**
   * @default en
   */
  mainLanguage: string; // IWritablePublicUser
}
