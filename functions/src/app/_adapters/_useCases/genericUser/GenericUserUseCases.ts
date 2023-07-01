import {
  IUser,
  IUserIdentificationData,
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

  public async write(object: T): Promise<T> {
    return this.genericObjectPersistenceGateway.write(object);
  }

  public async afterWrite(userBefore: null | T, userAfter: T): Promise<Record<string, object>> {
    const afterWriteUserResult: Record<string, object> =
      await this.genericObjectPersistenceGateway.afterWrite(userBefore, userAfter);

    const userIdentification = await this.userIdentificationServiceGateway.getUser(userAfter.id);

    if (userIdentification?.data) {
      const toUpdateAdminData: IUserIdentificationData = newUserIdentificationData({
        ...userIdentification.data,
        ...userAfter,
      });

      if (!this.jsonHelperServiceGateway.compareEqual(userIdentification.data, toUpdateAdminData)) {
        afterWriteUserResult['writeUserIdentification'] =
          await this.userIdentificationServiceGateway.setUserData(userAfter.id, toUpdateAdminData);
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
