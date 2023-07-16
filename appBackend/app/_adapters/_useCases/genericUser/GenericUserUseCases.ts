import {
  CustomError,
  CustomErrorCodes,
  DeepPartial,
  IUser,
  IUserCredentials,
  IUserIdentificationData,
  IWritableUser,
  newAdmin,
  newIdentifiableUuid,
  newUser,
  newUserIdentificationData,
  UserRoleEnum,
} from '../_domain';
import { IJsonHelperServiceGateway } from '../jsonHelper';
import { IUserIdentificationServiceGateway } from '../userIdentification';
import {
  GetWhereConditionsType,
  IGenericObjectPersistenceGateway,
  IGetWhereOrderByType,
} from '../jsonPersistence';
import { IGenericUserUseCases } from './IGenericUserUseCases';
import { IUserWithIdentificationResponse } from './_domain/IUserWithIdentificationResponse';

/**
 * Adapter for the persistence gateway of users.
 *
 * @template T - The type of the user.
 * @template R - The type of the user in the search engine.
 */
export class GenericUserUseCases<T extends IUser> implements IGenericUserUseCases<T> {
  constructor(
    protected jsonHelperServiceGateway: IJsonHelperServiceGateway,
    protected userIdentificationServiceGateway: IUserIdentificationServiceGateway,
    private genericObjectPersistenceGateway: IGenericObjectPersistenceGateway<T>
  ) {}

  public async createUser(
    userCredentials: IUserCredentials,
    writableUser: IWritableUser,
    role = UserRoleEnum.USER
  ): Promise<IUserWithIdentificationResponse> {
    const toCreateUserId = newIdentifiableUuid().id;

    try {
      const incompleteToCreateUser = {
        ...writableUser,
        ...userCredentials,
        role,
        id: toCreateUserId,
      };

      let toCreateUser: T;
      switch (role) {
        case UserRoleEnum.SUPER_ADMIN:
        case UserRoleEnum.ADMIN:
          toCreateUser = newAdmin(incompleteToCreateUser) as unknown as T;
          break;
        default:
          toCreateUser = newUser(incompleteToCreateUser) as unknown as T;
      }

      const user = await this.write(toCreateUser);

      const userIdentification = await this.userIdentificationServiceGateway.createUser(
        userCredentials,
        newUserIdentificationData(user)
      );

      return {
        user,
        userIdentification,
      };
    } catch (e) {
      await this.delete(toCreateUserId);

      throw e;
    }
  }

  public updateUser(writableUser: DeepPartial<IWritableUser>, user: IUser): Promise<IUser> {
    const toUpdateUser = newUser({
      ...user,
      ...writableUser,
      id: user.id,
    });

    return this.write(toUpdateUser as T);
  }

  public async write(object: T): Promise<T> {
    return this.genericObjectPersistenceGateway.write(object);
  }

  public async onWriteUser(
    userId: string,
    userBefore: T | null,
    userAfter: T | null
  ): Promise<Promise<Record<string, object>>> {
    if (userAfter) {
      if (userAfter.id !== userId) {
        await this.write({ ...userAfter, id: userId });
        return { idUpdated: { objectId: userId } };
      }

      return this.afterWrite(userBefore, userAfter);
    } else if (userBefore) {
      return this.afterDelete(userBefore);
    } else {
      throw new CustomError({
        code: CustomErrorCodes.IMPOSSIBLE_ERROR,
        message: 'Double null onWrite',
        payload: { objectId: userId },
        reportAsError: true,
        status: 'invalid-argument',
      });
    }
  }

  public async afterWrite(userBefore: null | T, userAfter: T): Promise<Record<string, object>> {
    const afterWriteUserResult: Record<string, object> =
      await this.genericObjectPersistenceGateway.afterWrite(userBefore, userAfter);

    const userId = userAfter.id;

    const userIdentification = await this.userIdentificationServiceGateway.getUser(userId);

    const toUpdateAdminData: IUserIdentificationData = newUserIdentificationData({
      ...(await this.jsonHelperServiceGateway.deepClone(userIdentification?.data)),
      ...userAfter,
    });

    const haveToUpdateUserIdentificationData =
      !this.jsonHelperServiceGateway.compareEqual(
        userIdentification?.data ?? {},
        toUpdateAdminData
      ) ||
      (userBefore && userBefore.email !== userAfter.email);
    if (haveToUpdateUserIdentificationData) {
      if (!userBefore || userBefore.email === userAfter.email) {
        afterWriteUserResult['writeUserIdentificationData'] =
          await this.userIdentificationServiceGateway.setUserData(userId, toUpdateAdminData);
      } else {
        try {
          afterWriteUserResult['writeUserIdentification'] =
            await this.userIdentificationServiceGateway.updateUser(
              {
                email: userAfter.email,
                password: Math.random().toString(36).slice(-8),
              },
              toUpdateAdminData,
              userId
            );
        } catch (e) {
          const error = e as CustomError;
          const rollbackEmailErrors = [
            CustomErrorCodes.USER_EMAIL_EXIST,
            CustomErrorCodes.BAD_FORMAT_EMAIL,
          ];
          if (rollbackEmailErrors.includes(error.code)) {
            await this.genericObjectPersistenceGateway.write({
              ...userAfter,
              email: userBefore.email,
            });
          }
        }
      }
    }

    return afterWriteUserResult;
  }

  public async read(objectId: string): Promise<T | null> {
    return this.genericObjectPersistenceGateway.read(objectId);
  }

  public async checkUsersWithRoleExistence(role: UserRoleEnum): Promise<boolean> {
    const retrievedUsers = await this.genericObjectPersistenceGateway.getWhere([
      { property: 'role', comparison: '==', valueToCompare: role },
    ]);

    return retrievedUsers.length > 0;
  }

  public async getAllUsersWithGivenRoles(roles: string[]): Promise<T[]> {
    let retrievedUsers: T[] = [];

    for (const role of roles) {
      retrievedUsers = retrievedUsers.concat(
        await this.genericObjectPersistenceGateway.getWhere([
          { property: 'givenRoles', comparison: 'array-contains', valueToCompare: role },
        ])
      );
    }

    return retrievedUsers;
  }

  public async getWhere(
    conditions: GetWhereConditionsType,
    orderBy?: IGetWhereOrderByType,
    limit?: number
  ): Promise<T[]> {
    return this.genericObjectPersistenceGateway.getWhere(conditions, orderBy, limit);
  }

  public async delete(objectId: string): Promise<object> {
    return this.genericObjectPersistenceGateway.delete(objectId);
  }

  public async afterDelete(deletedUser: T): Promise<Record<string, object>> {
    const userId = deletedUser.id;

    const deleteUserResult: Record<string, object> =
      await this.genericObjectPersistenceGateway.afterDelete(deletedUser);

    try {
      await this.userIdentificationServiceGateway.deleteUser(userId);
      deleteUserResult['deleteUserIdentification'] = { result: true };
    } catch (e) {
      deleteUserResult['deleteUserIdentification'] = e as object;
    }

    try {
      deleteUserResult['deleteUserDocument'] = await this.genericObjectPersistenceGateway.delete(
        userId
      );
    } catch (e) {
      deleteUserResult['deleteUserDocument'] = e as object;
    }

    return deleteUserResult;
  }
}
