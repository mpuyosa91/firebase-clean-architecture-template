import { IAdminUseCases, ICreateAdminResponse } from '../_useCases';
import { checkCreateAdminRequest } from './_domain/ICreateAdminRequest';

export class AdminController {
  constructor(private adminUseCases: IAdminUseCases) {}

  public async createSuperAdmin(_: any, __: string): Promise<ICreateAdminResponse> {
    return this.adminUseCases.createSuperAdmin();
  }

  public async createAdmin(request: any, _: string): Promise<ICreateAdminResponse> {
    const validatedRequest = checkCreateAdminRequest(request);

    return this.adminUseCases.createAdmin(
      {
        email: validatedRequest.admin.email,
        password: validatedRequest.admin.pass,
      },
      validatedRequest.admin
    );
  }
}
