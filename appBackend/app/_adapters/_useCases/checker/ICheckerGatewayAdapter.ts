import { IAdmin, IUser, IUserIdentification } from '../_domain';

export interface ICheckerGatewayAdapter {
  /**
   *
   * @param {string} userId
   */
  checkLoggedOut(userId: string): void;

  /**
   *
   * @param {string} userId
   */
  checkLoggedIn(userId: string): void;

  /**
   *
   * @param {string} userId
   * @returns {Promise<IUser>}
   */
  checkUserById(userId: string): Promise<IUser>;

  /**
   *
   * @param {string} userId
   * @returns {Promise<IUser>}
   */
  checkSuperAdmin(userId: string): Promise<IAdmin>;

  /**
   *
   * @param {string} userId
   * @returns {Promise<IUserIdentification>}
   */
  checkUserIdentificationById(userId: string): Promise<IUserIdentification>;

  /**
   *
   * @param {string} userEmail
   * @returns {Promise<IUserIdentification>}
   */
  checkUserIdentificationByEmail(userEmail: string): Promise<IUserIdentification>;
}
