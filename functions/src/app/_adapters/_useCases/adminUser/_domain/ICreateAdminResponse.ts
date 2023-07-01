import { IAdmin, IUserIdentification } from '../../_domain';

export interface ICreateAdminResponse {
  adminDocument: IAdmin;

  adminUser: IUserIdentification;

  sendVerificationEmailResult: object | null;

  temporaryPassword: string;
}
