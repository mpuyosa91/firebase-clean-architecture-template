import { IAdmin } from '../../_domain';

export interface IDeleteAdminResponse {
  admin: IAdmin;

  adminDeletionResult: object;
}
