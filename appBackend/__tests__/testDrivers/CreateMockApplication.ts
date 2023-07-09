import { Application } from '../../app/Application';
import { TestJsonWebServerFramework } from './TestJsonWebServerFramework';
import { MockUserIdentificationExternalInterfaceDriver } from './MockUserIdentificationExternalInterfaceDriver';
import { MockEmailSenderExternalInterfaceDriver } from './MockEmailSenderExternalInterfaceDriver';
import { MockGenericObjectPersistenceDriverFactory } from './MockGenericObjectPersistenceDriverFactory';
import { MockGenericObjectSearchEngineDriverFactory } from './MockGenericObjectSearchEngineDriverFactory';
import { CollectionNames, ObjectTypesEnum } from '../../app/_adapters';

export const userIdentificationExternalInterfaceDriver =
  new MockUserIdentificationExternalInterfaceDriver();
export const emailSenderExternalInterfaceDriver = new MockEmailSenderExternalInterfaceDriver();
export const genericObjectPersistenceDriverFactory =
  new MockGenericObjectPersistenceDriverFactory();
export const genericObjectSearchEngineDriverFactory =
  new MockGenericObjectSearchEngineDriverFactory();

Application.getInstance().initialize(
  new TestJsonWebServerFramework(),
  userIdentificationExternalInterfaceDriver,
  emailSenderExternalInterfaceDriver,
  genericObjectPersistenceDriverFactory,
  genericObjectSearchEngineDriverFactory
);

export const getSuperAdminId = async (): Promise<string> => {
  const superAdminList = await genericObjectPersistenceDriverFactory
    .getDB(CollectionNames.USERS)
    .getWhere([
      { property: 'role', comparison: '==', valueToCompare: ObjectTypesEnum.SUPER_ADMIN },
    ]);

  if (superAdminList.length <= 0) {
    const response = await getAdminController().createSuperAdmin({}, '');
    return response.adminDocument.id;
  }

  return superAdminList[0].id;
};

export const getGenericUserController = () => Application.getInstance().getGenericUserController();
export const getAdminController = () => Application.getInstance().getAdminController();
