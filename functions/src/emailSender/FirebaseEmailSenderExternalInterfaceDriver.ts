import { CollectionNames, EmailObject, IEmailSenderExternalInterfaceDriver } from 'appbackend';

import { FirebaseCloudFunctionsHelper } from '../jsonPresenter/FirebaseCloudFunctionsHelper';

/**
 * Blue Layer: Frameworks & Drivers (Drivers)
 */
export class FirebaseEmailSenderExternalInterfaceDriver
  implements IEmailSenderExternalInterfaceDriver
{
  public readonly firestoreDB = FirebaseCloudFunctionsHelper.getInstance().firestoreDB;

  public async sendEmail(email: EmailObject): Promise<object | null> {
    const db = this.firestoreDB;

    db.collection(CollectionNames.MAILS)
      .add(email)
      .catch((err) =>
        FirebaseCloudFunctionsHelper.getInstance().logMessage(
          'error',
          `Error on EmailSenderExternalInterface.sendEmail. ${JSON.stringify(err)}`
        )
      );

    return email;
  }
}
