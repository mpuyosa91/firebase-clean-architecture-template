import { IEmailSenderServiceGateway, IUserIdentificationData } from '../_useCases';
import {
  EmailObject,
  IEmailSenderExternalInterfaceDriver,
} from './IEmailSenderExternalInterfaceDriver';

export class EmailSenderServiceGatewayAdapter implements IEmailSenderServiceGateway {
  private FROM = '"MyApp Mail Service" <no-reply@myappmailservice.com>';

  constructor(private emailSenderExternalInterfaceDriver: IEmailSenderExternalInterfaceDriver) {}

  public async sendVerificationEmail(
    userIdentity: IUserIdentificationData,
    email: string
  ): Promise<object | null> {
    const emailObject: EmailObject = {
      from: this.FROM,
      to: email,
      message: {
        subject: '',
        text: '',
        html: '',
      },
    };

    await this.emailSenderExternalInterfaceDriver.sendEmail(emailObject);

    return { userIdentity, email };
  }

  public async sendChangePasswordMail(mainLanguage: string, email: string): Promise<object | null> {
    const emailObject: EmailObject = {
      from: this.FROM,
      to: email,
      message: {
        subject: '',
        text: '',
        html: '',
      },
    };

    await this.emailSenderExternalInterfaceDriver.sendEmail(emailObject);

    return { mainLanguage, email };
  }
}
