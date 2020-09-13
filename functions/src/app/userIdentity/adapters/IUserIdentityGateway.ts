import {
  IUserIdentityDataEntity,
  IUserIdentityEntity,
} from "../domain/UserIdentityEntity";

export interface IUserIdentityGateway {
  /**
   *
   * @param {string} userId
   * @returns {IUserIdentityEntity | null} retrievedUser
   * @throws {Error}
   */
  getUser(userId: string): Promise<IUserIdentityEntity | null>;

  /**
   *
   * @param {string} userId
   * @returns {boolean} userExists
   */
  checkUser(userId: string): Promise<boolean>;

  /**
   *
   * @param {string} userId
   * @returns {IUserIdentityDataEntity | null} retrievedUserData
   * @throws {Error}
   */
  getUserData(userId: string): Promise<IUserIdentityDataEntity | null>;

  /**
   *
   * @param {string} userId
   * @param {IUserIdentityDataEntity} data
   * @throws {Error}
   */
  setUserData(id: string, data: IUserIdentityDataEntity): Promise<void>;
}
