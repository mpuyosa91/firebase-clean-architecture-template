import {
  Application,
  CollectionNames,
  CustomError,
  CustomErrorCodes,
  IAdmin,
  IUser,
  newFakeCreateAdminRequest,
  newFakeCreateUserRequest,
  ObjectTypesEnum,
} from '../../app';
import { TestJsonWebServerFramework } from './TestJsonWebServerFramework';
import { MockUserIdentificationExternalInterfaceDriver } from './MockUserIdentificationExternalInterfaceDriver';
import { MockEmailSenderExternalInterfaceDriver } from './MockEmailSenderExternalInterfaceDriver';
import { MockGenericObjectPersistenceDriverFactory } from './MockGenericObjectPersistenceDriverFactory';
import { MockGenericObjectSearchEngineDriverFactory } from './MockGenericObjectSearchEngineDriverFactory';

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

export async function testFunction<T, R>(
  request: T,
  userId: string,
  toTestFunction: (request: T, userId: string) => Promise<R>,
  customErrorCodes?: CustomErrorCodes
): Promise<R | undefined> {
  try {
    const response = await toTestFunction(request, userId);

    !customErrorCodes ? expect(response).toBeTruthy() : expect(response).toBeFalsy();

    return response;
  } catch (e) {
    const error = e as CustomError;
    try {
      !customErrorCodes ? expect(error).toBeFalsy() : expect(error.code).toBe(customErrorCodes);
    } catch (assertionError) {
      console.error(error);
      throw assertionError;
    }
  }
}

export const fastCreateAdmin = async (): Promise<IAdmin> => {
  const { adminDocument } = await getAdminController().createAdmin(
    newFakeCreateAdminRequest(),
    await getSuperAdminId()
  );

  return adminDocument;
};
export const fastCreateUser = async (): Promise<IUser> => {
  const { user } = await getGenericUserController().createUser(newFakeCreateUserRequest(), '');

  return user;
};
