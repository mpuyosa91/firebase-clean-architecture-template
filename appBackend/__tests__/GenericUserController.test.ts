import {
  CollectionNames,
  CustomError,
  CustomErrorCodes,
  DeepPartial,
  ICreateUserRequest,
  ISearchEngineUser,
  newFakeCreateUserRequest,
} from '../app';
import { faker } from '@faker-js/faker';
import {
  genericObjectPersistenceDriverFactory,
  genericObjectSearchEngineDriverFactory,
  getGenericUserController,
  userIdentificationExternalInterfaceDriver,
} from './testDrivers/CreateMockApplication';
import { IUpdateUserRequest } from '../app/_adapters/genericUser/_domain/IUpdateUserRequest';
import { cloneDeep } from 'lodash';

describe('GenericUserController', () => {
  test('GUC001. Create User', async () => {
    const request = newFakeCreateUserRequest();

    await testCreateUser(request, '');
  });

  test('GUC001_1. Can not if logged In', async () => {
    const request = newFakeCreateUserRequest();

    await testCreateUser(request, faker.string.uuid(), CustomErrorCodes.LOGGED_IN);
  });

  test('GUC001_2. Can not if email exists', async () => {
    const request = newFakeCreateUserRequest();

    await testCreateUser(request, '');

    await testCreateUser(request, '', CustomErrorCodes.USER_EMAIL_EXIST);
  });

  test('GUC001_3. Can not if any param is missed', async () => {
    const request: DeepPartial<ICreateUserRequest> = newFakeCreateUserRequest();
    delete request?.user?.description;

    await testCreateUser(request as ICreateUserRequest, '', CustomErrorCodes.MISSED_ARGUMENT);
  });

  test('GUC001_4. Can not if any param does not complaint format', async () => {
    const request = newFakeCreateUserRequest();
    request.user.description = faker.lorem.paragraphs(10);

    await testCreateUser(request, '', CustomErrorCodes.BAD_FORMAT_ARGUMENT);
  });

  test('GUC002. Retrieve User', async () => {
    const { user } = await getGenericUserController().createUser(newFakeCreateUserRequest(), '');

    await testRetrieveUser(user.id);
  });

  test('GUC002_1. Can not retrieve being logged out', async () => {
    await testRetrieveUser('', CustomErrorCodes.NOT_LOGGED_IN);
  });

  test('GUC002_2. User not found notification', async () => {
    const { user } = await getGenericUserController().createUser(newFakeCreateUserRequest(), '');

    await genericObjectPersistenceDriverFactory.getDB(CollectionNames.USERS).delete(user.id);

    await testRetrieveUser(user.id, CustomErrorCodes.USER_NOT_FOUND);
  });

  test('GUC002_3. User Identification not found notification', async () => {
    const { user } = await getGenericUserController().createUser(newFakeCreateUserRequest(), '');

    await userIdentificationExternalInterfaceDriver.deleteUser(user.id);

    await testRetrieveUser(user.id, CustomErrorCodes.USER_NOT_FOUND);
  });

  test('GUC002_4. User can be found on SearchEngine', async () => {
    const { user } = await getGenericUserController().createUser(newFakeCreateUserRequest(), '');

    const searchEngineUser = cloneDeep(
      await genericObjectSearchEngineDriverFactory
        .getDB<ISearchEngineUser>(CollectionNames.USERS)
        .read(user.id)
    );

    expect(searchEngineUser).toBeTruthy();
    expect(user.id).toBe(searchEngineUser?.objectID);
  });

  test('GUC003. Update User', async () => {
    const { user } = await getGenericUserController().createUser(newFakeCreateUserRequest(), '');

    const request: DeepPartial<IUpdateUserRequest> = {
      user: { firstName: faker.person.firstName() },
    };
    const response = await testUpdateUser(request, user.id);

    expect(response).toBeTruthy();
    expect(user.firstName).not.toBe(response?.user.firstName);
  });

  test('GUC003_1. Update can be found on SearchEngine', async () => {
    const { user } = await getGenericUserController().createUser(newFakeCreateUserRequest(), '');

    const searchEngineUserBefore = cloneDeep(
      await genericObjectSearchEngineDriverFactory
        .getDB<ISearchEngineUser>(CollectionNames.USERS)
        .read(user.id)
    );

    const request: DeepPartial<IUpdateUserRequest> = {
      user: { firstName: faker.person.firstName() },
    };
    const response = await getGenericUserController().updateUser(request, user.id);

    const searchEngineUserAfter = cloneDeep(
      await genericObjectSearchEngineDriverFactory
        .getDB<ISearchEngineUser>(CollectionNames.USERS)
        .read(user.id)
    );

    expect(searchEngineUserBefore).toBeTruthy();
    expect(user.email).toBe(searchEngineUserBefore?.email);
    expect(user.firstName).toBe(searchEngineUserBefore?.firstName);

    expect(searchEngineUserAfter).toBeTruthy();
    expect(user.firstName).not.toBe(searchEngineUserAfter?.firstName);
    expect(response.user.email).toBe(searchEngineUserAfter?.email);
    expect(response.user.firstName).toBe(searchEngineUserAfter?.firstName);
  });

  test('GUC003_2. Can not update if an existing email', async () => {
    const { user: user1 } = await getGenericUserController().createUser(
      newFakeCreateUserRequest(),
      ''
    );
    const { user: user2 } = await getGenericUserController().createUser(
      newFakeCreateUserRequest(),
      ''
    );

    const request: DeepPartial<IUpdateUserRequest> = {
      email: user1.email,
    };
    await testUpdateUser(request, user2.id, CustomErrorCodes.USER_EMAIL_EXIST);
  });

  test('GUC004. Delete User', async () => {
    const { user } = await getGenericUserController().createUser(newFakeCreateUserRequest(), '');

    await testDeleteUser(user.id);
  });

  test('GUC004_1. Can not delete user twice', async () => {
    const { user } = await getGenericUserController().createUser(newFakeCreateUserRequest(), '');

    await testDeleteUser(user.id);

    await testDeleteUser(user.id, CustomErrorCodes.USER_ALREADY_DELETED);
  });

  test('GUC004_2. Already deleted if User Identification is deleted', async () => {
    const { user } = await getGenericUserController().createUser(newFakeCreateUserRequest(), '');

    await userIdentificationExternalInterfaceDriver.deleteUser(user.id);

    await testDeleteUser(user.id, CustomErrorCodes.USER_ALREADY_DELETED);
  });

  test('GUC004_3. Already deleted if User Object is deleted', async () => {
    const { user } = await getGenericUserController().createUser(newFakeCreateUserRequest(), '');

    await genericObjectPersistenceDriverFactory.getDB(CollectionNames.USERS).delete(user.id);

    await testDeleteUser(user.id, CustomErrorCodes.USER_ALREADY_DELETED);
  });

  async function testCreateUser(
    request: ICreateUserRequest,
    userId: string,
    customErrorCodes?: CustomErrorCodes
  ) {
    try {
      const response = await getGenericUserController().createUser(request, userId);

      !customErrorCodes ? expect(response.user).toBeTruthy() : expect(response).toBeFalsy();

      if (!customErrorCodes) {
        expect(request.email).toBe(response.userIdentification.email);
        expect(request.email).toBe(response.user.email);
        expect(request.user.firstName).toBe(response.userIdentification.data?.firstName);
        expect(request.user.firstName).toBe(response.user.firstName);
      }

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

  async function testRetrieveUser(userId: string, customErrorCodes?: CustomErrorCodes) {
    try {
      const response = await getGenericUserController().retrieveUser({}, userId);

      !customErrorCodes ? expect(response.user).toBeTruthy() : expect(response).toBeFalsy();

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

  async function testUpdateUser(
    request: DeepPartial<IUpdateUserRequest>,
    userId: string,
    customErrorCodes?: CustomErrorCodes
  ) {
    try {
      const response = await getGenericUserController().updateUser(request, userId);

      !customErrorCodes ? expect(response.user).toBeTruthy() : expect(response).toBeFalsy();

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

  async function testDeleteUser(userId: string, customErrorCodes?: CustomErrorCodes) {
    try {
      const response = await getGenericUserController().deleteUser({}, userId);

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
});
