import {
  checkWithId,
  CustomError,
  CustomErrorCodes,
  IAdminUseCases,
  ICheckerGatewayAdapter,
  IGenericUserUseCases,
  IUser,
  IUserCredentials,
  IUserIdentification,
  IUserResponse,
  IUserWithIdentificationResponse,
  IWithId,
  newAdmin,
  newNullable,
  newUser,
  ObjectTypesEnum,
  UserRoleEnum,
} from '../_useCases';
import { checkCreateUserRequest } from './_domain/ICreateUserRequest';
import { checkUpdateUserRequest } from './_domain/IUpdateUserRequest';

export class GenericUserController {
  constructor(
    private checkerServiceGateway: ICheckerGatewayAdapter,
    private genericUserUseCases: IGenericUserUseCases<IUser>,
    private adminUseCases: IAdminUseCases
  ) {}

  public async createUser(request: any, userId: string) {
    await this.checkerServiceGateway.checkLoggedOutOrAdmin(userId);

    const validatedRequest = checkCreateUserRequest(request);

    const userCredentials: IUserCredentials = {
      email: validatedRequest.email,
      password: validatedRequest.pass,
    };

    return this.genericUserUseCases.createUser(userCredentials, validatedRequest.user);
  }

  public async retrieveUser(
    request: object,
    userId: string
  ): Promise<IUserWithIdentificationResponse> {
    const mode = await this.checkerServiceGateway.checkLoggedInOrAdmin(userId);

    let validatedAdminRequest: IWithId | undefined;
    if (mode === UserRoleEnum.ADMIN) {
      validatedAdminRequest = checkWithId(request);
    }
    const toRetrieveUserId = validatedAdminRequest?.id ?? userId;

    const retrievedUser = await this.checkerServiceGateway.checkUserById(toRetrieveUserId);

    const retrievedUserIdentification =
      await this.checkerServiceGateway.checkUserIdentificationById(toRetrieveUserId);

    return {
      user: retrievedUser,
      userIdentification: retrievedUserIdentification,
    };
  }

  public async updateUser(request: any, userId: string): Promise<IUserResponse> {
    const mode = await this.checkerServiceGateway.checkLoggedInOrAdmin(userId);

    let validatedAdminRequest: IWithId | undefined;
    if (mode === UserRoleEnum.ADMIN) {
      validatedAdminRequest = checkWithId(request);
    }
    const toRetrieveUserId = validatedAdminRequest?.id ?? userId;

    const validatedRequest = checkUpdateUserRequest(request);

    if (validatedRequest.email) {
      let checkExistingEmail = null;
      try {
        checkExistingEmail = await this.checkerServiceGateway.checkUserIdentificationByEmail(
          validatedRequest.email
        );
      } catch (e) {
        const error = e as CustomError;
        if (error.code !== CustomErrorCodes.USER_IDENTIFICATION_NOT_FOUND) {
          throw error;
        }
      }

      if (checkExistingEmail) {
        throw new CustomError({
          code: CustomErrorCodes.USER_EMAIL_EXIST,
          message: `The email address is already in use by another account. Email: ${validatedRequest.email}`,
          status: 'failed-precondition',
        });
      }
    }

    const retrievedUser = await this.checkerServiceGateway.checkUserById(toRetrieveUserId);

    const updatedUser = await this.genericUserUseCases.updateUser(
      validatedRequest.user ?? {},
      retrievedUser
    );

    return {
      user: updatedUser,
    };
  }

  public async deleteUser(request: any, userId: string): Promise<object> {
    const mode = await this.checkerServiceGateway.checkLoggedInOrAdmin(userId);

    let validatedAdminRequest: IWithId | undefined;
    if (mode === UserRoleEnum.ADMIN) {
      validatedAdminRequest = checkWithId(request);
    }
    const toRetrieveUserId = validatedAdminRequest?.id ?? userId;

    let retrievedUser = null;
    try {
      retrievedUser = await this.checkerServiceGateway.checkUserById(toRetrieveUserId);
    } catch (e) {
      const error = e as CustomError;
      if (error.code !== CustomErrorCodes.USER_NOT_FOUND) {
        throw e;
      }
    }
    let retrievedUserIdentification = null;
    try {
      retrievedUserIdentification = await this.checkerServiceGateway.checkUserIdentificationById(
        toRetrieveUserId
      );
    } catch (e) {
      const error = e as CustomError;
      if (error.code !== CustomErrorCodes.USER_IDENTIFICATION_NOT_FOUND) {
        throw e;
      }
    }

    if (!retrievedUser && !retrievedUserIdentification) {
      throw new CustomError({
        code: CustomErrorCodes.USER_ALREADY_DELETED,
        message: 'User already Deleted',
        status: 'failed-precondition',
      });
    }

    return this.genericUserUseCases.delete(toRetrieveUserId);
  }

  public async onWriteObject(request: any, _: string): Promise<Record<string, object>> {
    const userId: string = request.objectId ?? '';
    const userBefore: IUser | null = request.objectBefore ?? null;
    const userAfter: IUser | null = request.objectAfter ?? null;

    const objectType = userAfter?.objectType ?? userBefore?.objectType ?? ObjectTypesEnum.NONE;

    switch (objectType) {
      case ObjectTypesEnum.ADMIN:
        return this.adminUseCases.onWriteUser(
          userId,
          newNullable(newAdmin, userBefore),
          newNullable(newAdmin, userAfter)
        );
      default:
        return this.genericUserUseCases.onWriteUser(
          userId,
          newNullable(newUser, userBefore),
          newNullable(newUser, userAfter)
        );
    }
  }

  public async onCreateUser(request: any, _: string): Promise<IUser> {
    const userId: string = request.userId ?? '';
    const user: IUserIdentification = request.user;

    const objectType = user?.data?.objectType ?? ObjectTypesEnum.NONE;

    try {
      const retrievedUser = await this.checkerServiceGateway.checkUserById(userId);
      if (retrievedUser) {
        return retrievedUser;
      }
    } catch (e) {
      const error = e as CustomError;
      if (error.code !== CustomErrorCodes.USER_NOT_FOUND) {
        throw e;
      }
    }

    switch (objectType) {
      case ObjectTypesEnum.ADMIN:
        return this.adminUseCases.write(newAdmin({ ...user, ...user.data, id: userId }));
      default:
        return this.genericUserUseCases.write(newUser({ ...user, ...user.data, id: userId }));
    }
  }

  public async onDeleteUser(request: any, _: string): Promise<object> {
    const userId: string = request.userId ?? '';
    const user: IUserIdentification | null = request.user ?? null;

    const objectType = user?.data?.objectType ?? ObjectTypesEnum.NONE;

    switch (objectType) {
      case ObjectTypesEnum.ADMIN:
        return this.adminUseCases.delete(userId);
      default:
        return this.genericUserUseCases.delete(userId);
    }
  }
}
