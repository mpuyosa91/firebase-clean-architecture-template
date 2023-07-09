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

  public checkLoggedOut(userId: string): void {
    if (userId) {
      throw new CustomError({
        code: CustomErrorCodes.LOGGED_IN,
        message: 'You can not be logged in, please log out',
        status: 'failed-precondition',
      });
    }
  }

  public checkLoggedIn(userId: string): void {
    if (!userId) {
      throw new CustomError({
        code: CustomErrorCodes.NOT_LOGGED_IN,
        message: 'You can not be logged out, please log in',
        status: 'failed-precondition',
      });
    }
  }

  public async checkUserById(userId: string): Promise<IUser> {
    const user = await this.genericObjectPersistenceGateway.read(userId);

    if (!user) {
      throw new CustomError({
        code: CustomErrorCodes.USER_NOT_FOUND,
        message: `User with id ${userId} not found`,
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
        message: `User with id ${userId} not found`,
        status: 'not-found',
      });
    }

    if (admin.role !== UserRoleEnum.SUPER_ADMIN) {
      throw new CustomError({
        code: CustomErrorCodes.MISSING_PRIVILEGES,
        message: 'You must be a SUPER_USER to perform this action',
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
        message: `User with id ${userId} not found`,
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
