import { CollectionNames, IEmailSenderExternalInterfaceDriver } from '../app';
import { getDB } from '../firebase';
import * as functions from 'firebase-functions';

/**
 * Blue Layer: Frameworks & Drivers (Drivers)
 */
export class FirebaseEmailSenderExternalInterfaceDriver
  implements IEmailSenderExternalInterfaceDriver
{
  private FROM = '"MyApp Mail Service" <no-reply@myappmailservice.com>';

  private static async saveEmail(info: Record<string, string>) {
    const firestoreDB = await getDB();

    return firestoreDB.collection(CollectionNames.MAILS).add({
      to: info.to,
      message: {
        subject: info.subject,
        text: info.text,
        html: info.html,
      },
    });
  }

  public async sendEmail(
    email: string,
    subject: string,
    content: string,
    htmlContent: string
  ): Promise<object | null> {
    const info: Record<string, string> = {
      from: this.FROM,
      to: email,
      subject,
      text: content,
      html: htmlContent,
    };

    FirebaseEmailSenderExternalInterfaceDriver.saveEmail(info).catch((err) =>
      functions.logger.error(
        'Error on EmailSenderExternalInterface.sendEmail. \n' + JSON.stringify(err)
      )
    );

    return info;
  }
}
