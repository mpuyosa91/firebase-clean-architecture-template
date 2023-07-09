import { IUserCredentials, IUserIdentification, IUserIdentificationData } from '../_useCases';

export interface IUserIdentificationExternalInterfaceDriver {
  /**
   *
   * @param {IUserCredentials} userData
   * @param {IUserIdentificationData} userDataClaims
   * @returns {string} createdUserId or null
   */
  createUser(
    userData: IUserCredentials,
    userDataClaims: IUserIdentificationData
  ): Promise<IUserIdentification>;

  /**
   *
   * @param {} userData
   * @param {} userDataClaims
   * @param {string} userId
   * @returns {Promise<>}
   */
  updateUser(
    userData: IUserCredentials,
    userDataClaims: IUserIdentificationData,
    userId: string
  ): Promise<IUserIdentification>;

  /**
   *
   * @param {string} language
   * @param {string} email
   * @param {string} url
   * @returns {Promise<string>}
   */
  generateEmailVerificationLink(language: string, email: string, url: string): Promise<string>;

  /**
   *
   * @param {string} userId
   * @returns {(IUserIdentification | null)} retrievedUser or null
   * @throws {Error}
   */
  getUser(userId: string): Promise<IUserIdentification | null>;

  /**
   *
   * @returns {Promise<[]>}
   */
  getAllUsers(): Promise<IUserIdentification[]>;

  /**
   *
   * @param {string} email
   * @returns {Promise<IUserIdentification | null>}
   */
  getUserByEmail(email: string): Promise<IUserIdentification | null>;

  /**
   *
   * @param {string} userId
   * @param {any} data
   * @returns {IUserIdentificationData} updatedUserData
   * @throws {Error}
   */
  setUserData(userId: string, data: IUserIdentificationData): Promise<IUserIdentificationData>;

  /**
   *
   * @param {string} language
   * @param {string} email
   * @param {string} url
   * @returns {Promise<string>}
   */
  generatePasswordResetLink(language: string, email: string, url: string): Promise<string>;

  /**
   *
   * @param userId
   */
  deleteUser(userId: string): Promise<void>;
}
