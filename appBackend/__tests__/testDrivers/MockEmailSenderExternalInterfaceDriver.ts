import { EmailObject, IEmailSenderExternalInterfaceDriver } from '../../app/_adapters';
import { faker } from '@faker-js/faker';

export class MockEmailSenderExternalInterfaceDriver implements IEmailSenderExternalInterfaceDriver {
  private internalDB: Record<string, EmailObject> = {};
  sendEmail(email: EmailObject): Promise<object | null> {
    this.internalDB[faker.string.uuid()] = email;

    return Promise.resolve(email);
  }
}
