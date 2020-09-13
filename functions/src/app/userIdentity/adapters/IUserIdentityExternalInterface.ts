import {
  IUserIdentityDataEntity,
  IUserIdentityEntity,
} from "../domain/UserIdentityEntity";

export interface IUserIdentityExternalInterface {
  /**
   *
   * @param {string} userId
   * @returns {IUserIdentityEntity | null} retrievedUser
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
   * @returns {(any | null)} retrievedUserData
   */
  getDataOfUser(userId: string): Promise<IUserIdentityDataEntity | null>;

  /**
   *
   * @param {string} userId
   * @param {any} data
   */
  setDataInUser(id: string, data: IUserIdentityDataEntity): Promise<void>;
}
