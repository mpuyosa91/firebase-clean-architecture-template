import {
  CustomError,
  CustomErrorCodes,
  IAdminUseCases,
  ICheckerGatewayAdapter,
  ICreateAdminResponse,
} from '../_useCases';
import { checkCreateAdminRequest } from './_domain/ICreateAdminRequest';

export class AdminController {
  constructor(
    private checkerServiceGateway: ICheckerGatewayAdapter,
    private adminUseCases: IAdminUseCases
  ) {}

  public async createSuperAdmin(_: any, __: string): Promise<ICreateAdminResponse> {
    return this.adminUseCases.createSuperAdmin();
  }

  public async createAdmin(request: any, userId: string): Promise<ICreateAdminResponse> {
    await this.checkerServiceGateway.checkSuperAdmin(userId);

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
