import { IAdmin, IUserCredentials, IWritableAdmin } from '../_domain';
import { IGenericUserUseCases } from '../genericUser';
import { ICreateAdminResponse } from './_domain/ICreateAdminResponse';

export interface IAdminUseCases extends IGenericUserUseCases<IAdmin> {
  /**
   *
   * @returns {Promise<object>}
   */
  createSuperAdmin(): Promise<ICreateAdminResponse>;

  /**
   *
   * @param {} userCredentials
   * @param {} writableAdmin
   * @param {boolean} superAdmin
   * @returns {Promise<object>}
   */
  createAdmin(
    userCredentials: IUserCredentials,
    writableAdmin: IWritableAdmin,
    superAdmin?: boolean
  ): Promise<ICreateAdminResponse>;
}
