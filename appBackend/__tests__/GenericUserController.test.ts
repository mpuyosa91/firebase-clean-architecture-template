import {
  CollectionNames,
  CustomErrorCodes,
  DeepPartial,
  ICreateUserRequest,
  ISearchEngineUser,
  IUpdateUserRequest,
  IUser,
  newFakeCreateUserRequest,
  UserRoleEnum,
} from '../app';
import {
  fastCreateUser,
  genericObjectPersistenceDriverFactory,
  genericObjectSearchEngineDriverFactory,
  getGenericUserController,
  testFunction,
  userIdentificationExternalInterfaceDriver,
} from './testDrivers/CreateMockApplication';
import { faker } from '@faker-js/faker';
import { cloneDeep } from 'lodash';

describe('GenericUserController', () => {
  test('GUC001. Create User', async () => {
    const request = newFakeCreateUserRequest();

    const { user, userIdentification } = await getGenericUserController().createUser(request, '');

    expect(user.role).toBe(UserRoleEnum.USER);
    expect(user.email).toBe(request.email);
    expect(user.firstName).toBe(request.user.firstName);

    expect(userIdentification.data?.role).toBe(UserRoleEnum.USER);
    expect(userIdentification.email).toBe(request.email);
    expect(userIdentification.data?.firstName).toBe(request.user.firstName);
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

  test('GUC001_5. User may have one given role', async () => {
    const user = await fastCreateUser();

    const userDocument = await genericObjectPersistenceDriverFactory
      .getDB<IUser>(CollectionNames.USERS)
      .read(user.id);

    expect(userDocument).toBeTruthy();
    expect(userDocument?.givenRoles).toStrictEqual([UserRoleEnum.USER]);
  });

  test('GUC002. Retrieve User', async () => {
    const user = await fastCreateUser();

    const response = await testRetrieveUser(user.id);

    expect(response?.user).toBeTruthy();
  });

  test('GUC002_1. Can not retrieve being logged out', async () => {
    await testRetrieveUser('', CustomErrorCodes.NOT_LOGGED_IN);
  });

  test('GUC002_2. User not found notification', async () => {
    const user = await fastCreateUser();

    await genericObjectPersistenceDriverFactory.getDB(CollectionNames.USERS).delete(user.id);

    await testRetrieveUser(user.id, CustomErrorCodes.USER_NOT_FOUND);
  });

  test('GUC002_3. User Identification not found notification', async () => {
    const user = await fastCreateUser();

    await userIdentificationExternalInterfaceDriver.deleteUser(user.id);

    await testRetrieveUser(user.id, CustomErrorCodes.USER_NOT_FOUND);
  });

  test('GUC002_4. User can be found on SearchEngine', async () => {
    const user = await fastCreateUser();

    const searchEngineUser = cloneDeep(
      await genericObjectSearchEngineDriverFactory
        .getDB<ISearchEngineUser>(CollectionNames.USERS)
        .read(user.id)
    );

    expect(searchEngineUser).toBeTruthy();
    expect(user.id).toBe(searchEngineUser?.objectID);
  });

  test('GUC003. Update User', async () => {
    const user = await fastCreateUser();

    const request: DeepPartial<IUpdateUserRequest> = {
      user: { firstName: faker.person.firstName() },
    };
    const { user: updatedUser } = await getGenericUserController().updateUser(request, user.id);

    expect(updatedUser).toBeTruthy();
    expect(user.firstName).not.toBe(updatedUser.firstName);
  });

  test('GUC003_1. Update can be found on SearchEngine', async () => {
    const user = await fastCreateUser();

    const searchEngineUserBefore = cloneDeep(
      await genericObjectSearchEngineDriverFactory
        .getDB<ISearchEngineUser>(CollectionNames.USERS)
        .read(user.id)
    );

    const response = await getGenericUserController().updateUser(
      { user: { firstName: faker.person.firstName() } },
      user.id
    );

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
    const user1 = await fastCreateUser();
    const user2 = await fastCreateUser();

    const request: DeepPartial<IUpdateUserRequest> = {
      email: user1.email,
    };
    await testUpdateUser(request, user2.id, CustomErrorCodes.USER_EMAIL_EXIST);
  });

  test('GUC004. Delete User', async () => {
    const user = await fastCreateUser();

    await testDeleteUser(user.id);
  });

  test('GUC004_1. Can not delete user twice', async () => {
    const user = await fastCreateUser();

    await testDeleteUser(user.id);

    await testDeleteUser(user.id, CustomErrorCodes.USER_ALREADY_DELETED);
  });

  test('GUC004_2. Already deleted if User Identification is deleted', async () => {
    const user = await fastCreateUser();

    await userIdentificationExternalInterfaceDriver.deleteUser(user.id);

    await testDeleteUser(user.id, CustomErrorCodes.USER_ALREADY_DELETED);
  });

  test('GUC004_3. Already deleted if User Object is deleted', async () => {
    const user = await fastCreateUser();

    await genericObjectPersistenceDriverFactory.getDB(CollectionNames.USERS).delete(user.id);

    await testDeleteUser(user.id, CustomErrorCodes.USER_ALREADY_DELETED);
  });

  async function testCreateUser(
    request: ICreateUserRequest,
    userId: string,
    customErrorCodes?: CustomErrorCodes
  ) {
    return testFunction(
      request,
      userId,
      (request, userId) => getGenericUserController().createUser(request, userId),
      customErrorCodes
    );
  }

  async function testRetrieveUser(userId: string, customErrorCodes?: CustomErrorCodes) {
    return testFunction(
      {},
      userId,
      (request, userId) => getGenericUserController().retrieveUser(request, userId),
      customErrorCodes
    );
  }

  async function testUpdateUser(
    request: DeepPartial<IUpdateUserRequest>,
    userId: string,
    customErrorCodes?: CustomErrorCodes
  ) {
    return testFunction(
      request,
      userId,
      (request, userId) => getGenericUserController().updateUser(request, userId),
      customErrorCodes
    );
  }

  async function testDeleteUser(userId: string, customErrorCodes?: CustomErrorCodes) {
    return testFunction(
      {},
      userId,
      (request, userId) => getGenericUserController().deleteUser(request, userId),
      customErrorCodes
    );
  }
});
