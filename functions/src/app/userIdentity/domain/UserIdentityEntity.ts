// Run bellow command to generate the schema validator and replace it into EnterpriseAdminGuestSchemaValidator.ts
// npx typescript-json-schema src/app/userIdentity/domain/UserIdentityEntity.ts * --required

export enum UserIdentityDataRoleEnum {
  NONE = "NONE",
  ADMIN = "ADMIN",
}

export interface IUserIdentityEntity {
  id: string;
  /**
   *
   * @default UserIdentityDataRoleEnum.NONE
   */
  role: UserIdentityDataRoleEnum;
  /**
   *
   * @default null
   */
  data: IUserIdentityDataEntity | null;
}

export interface IUserIdentityDataEntity {
  /**
   *
   * @default null
   */
  firstName: string | null;
  /**
   *
   * @default null
   */
  lastName: string | null;
  /**
   *
   * @default null
   */
  email: string | null;
}
