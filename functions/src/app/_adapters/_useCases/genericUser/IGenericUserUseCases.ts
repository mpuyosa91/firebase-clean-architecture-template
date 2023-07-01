import { IUser, UserRoleEnum } from '../_domain';
import { IGenericObjectPersistenceGateway } from '../jsonPersistence';

/**
 * Persistence gateway for user objects.
 *
 * @template T - The type of the user object.
 */
export interface IGenericUserUseCases<T extends IUser> extends IGenericObjectPersistenceGateway<T> {
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
