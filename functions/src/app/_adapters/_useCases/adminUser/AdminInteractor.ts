import {
  CustomError,
  CustomErrorCodes,
  IAdmin,
  IUserCredentials,
  IUserIdentification,
  IWritableAdmin,
  newAdmin,
  newNullable,
  newUserIdentificationData,
  newWritableAdmin,
  UserRoleEnum,
} from '../_domain';
import { GenericUserUseCases } from '../genericUser';
import { IJsonHelperServiceGateway } from '../jsonHelper';
import { IUserIdentificationServiceGateway } from '../userIdentification';
import { IGenericObjectPersistenceGateway } from '../jsonPersistence';
import { IEmailSenderServiceGateway } from '../emailSender';
import { IAdminUseCases } from './IAdminUseCases';
import { ICreateAdminResponse } from './_domain/ICreateAdminResponse';

export const adminEmail = 'admin@myapp.com';
export const genericPassword = 'myApp1234';

export class AdminInteractor extends GenericUserUseCases<IAdmin> implements IAdminUseCases {
  constructor(
    protected jsonHelperServiceGateway: IJsonHelperServiceGateway,
    protected userIdentificationServiceGateway: IUserIdentificationServiceGateway,
    genericObjectPersistenceGateway: IGenericObjectPersistenceGateway<IAdmin>,
    protected emailSenderServiceGateway: IEmailSenderServiceGateway
  ) {
    super(
      jsonHelperServiceGateway,
      userIdentificationServiceGateway,
      genericObjectPersistenceGateway
    );
  }

  public async createSuperAdmin(): Promise<ICreateAdminResponse> {
    if (await this.checkUsersWithRoleExistence(UserRoleEnum.SUPER_ADMIN)) {
      throw new CustomError({
        code: CustomErrorCodes.SUPER_ADMIN_ALREADY_EXISTS,
        message: 'There is an existing Super Admin',
        reportAsError: true,
        status: 'already-exists',
      });
    }

    return this.createAdmin(
      { email: adminEmail, password: genericPassword },
      newWritableAdmin({
        firstName: 'SuperAdmin',
        lastName: 'MyApp',
        mainLanguage: 'en',
      }),
      true
    );
  }

  public async createAdmin(
    userCredentials: IUserCredentials,
    writableAdmin: IWritableAdmin,
    superAdmin = false
  ): Promise<ICreateAdminResponse> {
    if (!superAdmin) {
      userCredentials.password = Math.random().toString(36).slice(-8);
    }

    let creationError: CustomError | null = null;

    let adminUser: IUserIdentification | null = null;
    let adminDocument: IAdmin | null = null;
    try {
      const adminUserData = newUserIdentificationData({
        ...writableAdmin,
        role: superAdmin ? UserRoleEnum.SUPER_ADMIN : UserRoleEnum.ADMIN,
      });

      adminUser = await this.userIdentificationServiceGateway.createUser(
        userCredentials,
        adminUserData
      );

      adminDocument = await this.write(
        newAdmin({
          ...adminUser.data,
          email: adminUser.email,
          id: adminUser.id,
        })
      );
    } catch (e) {
      creationError = new CustomError({
        code: CustomErrorCodes.ADMIN_CREATION_ERROR,
        message: (e as Error).message,
        payload: { rawError: e },
        status: 'unknown',
      });
    }

    if (creationError || !adminUser || !adminDocument) {
      if (adminUser || adminDocument) {
        await this.delete(adminUser?.id ?? adminDocument?.id ?? '');
      }

      throw creationError;
    }

    const sendVerificationEmailResult = await this.emailSenderServiceGateway.sendVerificationEmail(
      newUserIdentificationData(adminUser.data ?? undefined),
      adminUser.email
    );

    return {
      adminUser,
      adminDocument,
      temporaryPassword: userCredentials.password,
      sendVerificationEmailResult,
    };
  }

  public async write(admin: IAdmin): Promise<IAdmin> {
    return super.write(newAdmin(admin));
  }

  public async afterWrite(
    userBefore: null | IAdmin,
    userAfter: IAdmin
  ): Promise<Record<string, object>> {
    return super.afterWrite(newNullable(newAdmin, userBefore), newAdmin(userAfter));
  }

  public async read(adminId: string): Promise<IAdmin | null> {
    return newNullable(newAdmin, await super.read(adminId));
  }

  public async delete(adminId: string): Promise<object> {
    return super.afterDelete(newAdmin({ id: adminId }));
  }

  public async afterDelete(deletedUser: IAdmin): Promise<Record<string, object>> {
    return super.afterDelete(newAdmin(deletedUser));
  }
}
