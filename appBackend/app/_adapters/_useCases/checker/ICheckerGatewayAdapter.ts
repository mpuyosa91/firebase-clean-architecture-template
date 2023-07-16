import { IAdmin, IUser, IUserIdentification, UserRoleEnum } from '../_domain';

export interface ICheckerGatewayAdapter {
  /**
   *
   * @param {string} userId
   */
  checkLoggedOutOrAdmin(userId: string): Promise<UserRoleEnum.USER | UserRoleEnum.ADMIN>;

  /**
   *
   * @param {string} userId
   */
  checkLoggedInOrAdmin(userId: string): Promise<UserRoleEnum.USER | UserRoleEnum.ADMIN>;

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
   * @returns {Promise<IAdmin>}
   */
  checkAdmin(userId: string): Promise<IAdmin>;

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
