import { IUserCredentials, IUserIdentification, IUserIdentificationData } from '../_domain';

export interface IUserIdentificationServiceGateway {
  /**
   *
   * @param {IUserCredentials} userData
   * @param {IUserIdentificationData} userDataClaims
   * @returns {IUserIdentification} createdUserId or null
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
   * @param {string} userId
   * @returns {(IUserIdentification | null)} retrievedUser
   */
  getUser(userId: string): Promise<IUserIdentification | null>;

  /**
   *
   * @param {string} email
   * @returns {Promise<IUserIdentification | null>}
   */
  getUserByEmail(email: string): Promise<IUserIdentification | null>;

  /**
   *
   * @param {string} userId
   * @returns {(IUserIdentificationData | null)} retrievedUserData or null
   */
  getUserData(userId: string): Promise<IUserIdentificationData | null>;

  /**
   *
   * @param {string} id
   * @param {IUserIdentificationData} data
   * @returns {Promise<IUserIdentificationData>}
   */
  setUserData(id: string, data: IUserIdentificationData): Promise<IUserIdentificationData>;

  /**
   *
   * @param {string} language
   * @param {string} email
   * @returns {Promise<string>}
   */
  generatePasswordResetLink(language: string, email: string): Promise<string>;

  /**
   *
   * @param userId
   */
  deleteUser(userId: string): Promise<void>;
}
