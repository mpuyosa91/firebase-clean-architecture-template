import { DeepPartial, IUser, IUserCredentials, IWritableUser, UserRoleEnum } from '../_domain';
import { IGenericObjectPersistenceGateway } from '../jsonPersistence';
import { IUserWithIdentificationResponse } from './_domain/IUserWithIdentificationResponse';

/**
 * Persistence gateway for user objects.
 *
 * @template T - The type of the user object.
 */
export interface IGenericUserUseCases<T extends IUser> extends IGenericObjectPersistenceGateway<T> {
  /**
   *
   * @param {IUserCredentials} userCredentials
   * @param {IWritableUser} writableUser
   * @param {UserRoleEnum} role
   * @returns {Promise<IUserWithIdentificationResponse>}
   */
  createUser(
    userCredentials: IUserCredentials,
    writableUser: IWritableUser,
    role?: UserRoleEnum
  ): Promise<IUserWithIdentificationResponse>;

  /**
   *
   * @param {IWritableUser} writableUser
   * @param {IUser} user
   * @returns {Promise<IUserWithIdentificationResponse>}
   */
  updateUser(writableUser: DeepPartial<IWritableUser>, user: IUser): Promise<IUser>;

  /**
   *
   * @param {string} userId
   * @param {T | null} userBefore
   * @param {T | null} userAfter
   * @returns {Promise<Promise<Record<string, object>>>}
   */
  onWriteUser(
    userId: string,
    userBefore: T | null,
    userAfter: T | null
  ): Promise<Promise<Record<string, object>>>;

  /**
   * Checks if users with the specified role exist.
   *
   * @param {UserRoleEnum} role - The role to check for existence.
   * @returns {Promise<boolean>} A promise that resolves to true if users with the role exist, or false otherwise.
   */
  checkUsersWithRoleExistence(role: UserRoleEnum): Promise<boolean>;

  /**
   * Retrieves all users with the given roles.
   *
   * @param {string[]} roles - The roles to filter the users.
   * @returns {Promise<T[]>} A promise that resolves to an array of users with the given roles.
   */
  getAllUsersWithGivenRoles(roles: string[]): Promise<T[]>;
}
