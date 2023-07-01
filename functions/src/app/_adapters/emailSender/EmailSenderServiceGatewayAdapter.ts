import { IEmailSenderServiceGateway, IUserIdentificationData } from '../_useCases';
import { IEmailSenderExternalInterfaceDriver } from './IEmailSenderExternalInterfaceDriver';

export class EmailSenderServiceGatewayAdapter implements IEmailSenderServiceGateway {
  constructor(private emailSenderExternalInterfaceDriver: IEmailSenderExternalInterfaceDriver) {}

  public async sendVerificationEmail(
    userIdentity: IUserIdentificationData,
    email: string
  ): Promise<object | null> {
    await this.emailSenderExternalInterfaceDriver.sendEmail(email, '', '', '');

    return { userIdentity, email };
  }

  public async sendChangePasswordMail(mainLanguage: string, email: string): Promise<object | null> {
    await this.emailSenderExternalInterfaceDriver.sendEmail(email, '', '', '');

    return { mainLanguage, email };
  }
}
