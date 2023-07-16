import {
  CustomError,
  CustomErrorCodes,
  IAdmin,
  ICheckerGatewayAdapter,
  IGenericObjectPersistenceGateway,
  IUser,
  IUserIdentification,
  IUserIdentificationServiceGateway,
  UserRoleEnum,
} from '../_useCases';

export class CheckerGatewayAdapter implements ICheckerGatewayAdapter {
  constructor(
    private genericObjectPersistenceGateway: IGenericObjectPersistenceGateway<IUser>,
    private adminPersistenceGateway: IGenericObjectPersistenceGateway<IAdmin>,
    private userIdentificationServiceGateway: IUserIdentificationServiceGateway
  ) {}

  public async checkLoggedOutOrAdmin(
    userId: string
  ): Promise<UserRoleEnum.USER | UserRoleEnum.ADMIN> {
    if (await this.checkIfAdminOrContinue(userId)) {
      return UserRoleEnum.ADMIN;
    }

    if (userId) {
      throw new CustomError({
        code: CustomErrorCodes.LOGGED_IN,
        message: 'You can not be logged in, please log out',
        status: 'failed-precondition',
      });
    }

    return UserRoleEnum.USER;
  }

  public async checkLoggedInOrAdmin(
    userId: string
  ): Promise<UserRoleEnum.USER | UserRoleEnum.ADMIN> {
    if (await this.checkIfAdminOrContinue(userId)) {
      return UserRoleEnum.ADMIN;
    }

    if (!userId) {
      throw new CustomError({
        code: CustomErrorCodes.NOT_LOGGED_IN,
        message: 'You can not be logged out, please log in',
        status: 'failed-precondition',
      });
    }

    return UserRoleEnum.USER;
  }

  private async checkIfAdminOrContinue(userId: string): Promise<boolean> {
    const allowedErrors = [CustomErrorCodes.MISSING_PRIVILEGES, CustomErrorCodes.USER_NOT_FOUND];

    let mode = UserRoleEnum.USER;
    try {
      const adminUser = await this.checkAdmin(userId);
      if (adminUser.givenRoles.includes(UserRoleEnum.ADMIN)) {
        mode = UserRoleEnum.ADMIN;
      }
    } catch (e) {
      const error = e as CustomError;
      if (!allowedErrors.includes(error.code)) {
        throw e;
      }
    }
    return mode === UserRoleEnum.ADMIN;
  }

  public async checkUserById(userId: string): Promise<IUser> {
    const user = await this.genericObjectPersistenceGateway.read(userId);

    if (!user) {
      throw new CustomError({
        code: CustomErrorCodes.USER_NOT_FOUND,
        message: `User with id <${userId}> not found`,
        status: 'not-found',
      });
    }

    return user;
  }

  public async checkSuperAdmin(userId: string): Promise<IAdmin> {
    const admin = await this.adminPersistenceGateway.read(userId);

    if (!admin) {
      throw new CustomError({
        code: CustomErrorCodes.USER_NOT_FOUND,
        message: `SuperAdmin with id <${userId}> not found`,
        status: 'not-found',
      });
    }

    if (!admin.givenRoles.includes(UserRoleEnum.SUPER_ADMIN)) {
      throw new CustomError({
        code: CustomErrorCodes.MISSING_PRIVILEGES,
        message: 'You must be a SUPER_USER to perform this action',
        status: 'failed-precondition',
      });
    }

    return admin;
  }

  public async checkAdmin(userId: string): Promise<IAdmin> {
    const admin = await this.adminPersistenceGateway.read(userId);

    if (!admin) {
      throw new CustomError({
        code: CustomErrorCodes.USER_NOT_FOUND,
        message: `Admin with id ${userId} not found`,
        status: 'not-found',
      });
    }

    if (!admin.givenRoles.includes(UserRoleEnum.ADMIN)) {
      throw new CustomError({
        code: CustomErrorCodes.MISSING_PRIVILEGES,
        message: 'You must be a ADMIN to perform this action',
        status: 'failed-precondition',
      });
    }

    return admin;
  }

  public async checkUserIdentificationById(userId: string): Promise<IUserIdentification> {
    const userIdentification = await this.userIdentificationServiceGateway.getUser(userId);

    if (!userIdentification) {
      throw new CustomError({
        code: CustomErrorCodes.USER_IDENTIFICATION_NOT_FOUND,
        message: `User Identification with id ${userId} not found`,
        status: 'not-found',
      });
    }

    return userIdentification;
  }

  public async checkUserIdentificationByEmail(userEmail: string): Promise<IUserIdentification> {
    const userIdentification = await this.userIdentificationServiceGateway.getUserByEmail(
      userEmail
    );

    if (!userIdentification) {
      throw new CustomError({
        code: CustomErrorCodes.USER_IDENTIFICATION_NOT_FOUND,
        message: `User with email ${userEmail} not found`,
        status: 'not-found',
      });
    }

    return userIdentification;
  }
}
