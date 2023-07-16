import {
  CollectionNames,
  CustomErrorCodes,
  DeepPartial,
  IAdmin,
  ICreateAdminRequest,
  IUpdateUserRequest,
  IUser,
  newFakeCreateAdminRequest,
  newFakeCreateUserRequest,
  UserRoleEnum,
} from '../app';
import {
  fastCreateAdmin,
  fastCreateUser,
  genericObjectPersistenceDriverFactory,
  getAdminController,
  getGenericUserController,
  getSuperAdminId,
  testFunction,
} from './testDrivers/CreateMockApplication';
import { faker } from '@faker-js/faker';

describe('AdminController', () => {
  test('AUC001. Create Super Admin', async () => {
    const { adminDocument, adminUser } = await getAdminController().createSuperAdmin({}, '');

    expect(adminDocument.role).toBe(UserRoleEnum.SUPER_ADMIN);
    expect(adminUser.data?.role).toBe(UserRoleEnum.SUPER_ADMIN);
  });

  test('AUC001_1. Can not create two Super Admin', async () => {
    await testCreateSuperAdmin('', CustomErrorCodes.SUPER_ADMIN_ALREADY_EXISTS);
  });

  test('AUC001_2. Super Admin should have two given roles', async () => {
    const superAdminId = await getSuperAdminId();

    const superUser = await genericObjectPersistenceDriverFactory
      .getDB<IAdmin>(CollectionNames.USERS)
      .read(superAdminId);

    expect(superUser).toBeTruthy();
    expect(superUser?.givenRoles).toStrictEqual([UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN]);
  });

  test('AUC002. Create Admin', async () => {
    const request = newFakeCreateAdminRequest();

    const { adminDocument, adminUser } = await getAdminController().createAdmin(
      request,
      await getSuperAdminId()
    );

    expect(adminDocument.role).toBe(UserRoleEnum.ADMIN);
    expect(adminDocument.email).toBe(request.admin.email);
    expect(adminDocument.firstName).toBe(request.admin.firstName);

    expect(adminUser.data?.role).toBe(UserRoleEnum.ADMIN);
    expect(adminUser.email).toBe(request.admin.email);
    expect(adminUser.data?.firstName).toBe(request.admin.firstName);
  });

  test('AUC002_1. Only Super Admin can create Admins', async () => {
    const admin = await fastCreateAdmin();

    const request = newFakeCreateAdminRequest();

    await testCreateAdmin(request, admin.id, CustomErrorCodes.MISSING_PRIVILEGES);
  });

  test('AUC002_2. Can not create two admins with the same email', async () => {
    const admin = await fastCreateAdmin();

    const request = newFakeCreateAdminRequest();

    await testCreateAdmin(request, admin.id, CustomErrorCodes.MISSING_PRIVILEGES);
  });

  test('AUC002_3. Admin should have one given roles', async () => {
    const admin = await fastCreateAdmin();

    const superUser = await genericObjectPersistenceDriverFactory
      .getDB<IAdmin>(CollectionNames.USERS)
      .read(admin.id);

    expect(superUser).toBeTruthy();
    expect(superUser?.givenRoles).toStrictEqual([UserRoleEnum.ADMIN]);
  });

  test('AUC003. Admin can create users', async () => {
    const { user, userIdentification } = await getGenericUserController().createUser(
      newFakeCreateUserRequest(),
      await getSuperAdminId()
    );

    expect(user.role).toBe(UserRoleEnum.USER);
    expect(userIdentification.data?.role).toBe(UserRoleEnum.USER);
  });

  test('AUC004. Admin can retrieve users', async () => {
    const admin = await fastCreateAdmin();
    const newUser = await fastCreateUser();

    const { user, userIdentification } = await getGenericUserController().retrieveUser(
      { id: newUser.id },
      admin.id
    );

    expect(user.id).not.toBe(admin.firstName);
    expect(user.role).toBe(UserRoleEnum.USER);
    expect(userIdentification.data?.role).toBe(UserRoleEnum.USER);
  });

  test('AUC005. Admin can update users', async () => {
    const admin = await fastCreateAdmin();
    const user = await fastCreateUser();

    const request: DeepPartial<IUpdateUserRequest> = {
      user: { firstName: faker.person.firstName() },
    };
    const { user: updatedUser } = await getGenericUserController().updateUser(
      { ...request, id: user.id },
      admin.id
    );

    expect(updatedUser).toBeTruthy();
    expect(user.id).not.toBe(admin.firstName);
    expect(user.firstName).not.toBe(updatedUser.firstName);
  });

  test('AUC006. Admin can delete users', async () => {
    const admin = await fastCreateAdmin();
    const user = await fastCreateUser();

    const response = await getGenericUserController().deleteUser({ id: user.id }, admin.id);

    expect(response).toBeTruthy();

    const nonDeletedAdmin = await genericObjectPersistenceDriverFactory
      .getDB<IAdmin>(CollectionNames.USERS)
      .read(admin.id);
    const deletedUser = await genericObjectPersistenceDriverFactory
      .getDB<IUser>(CollectionNames.USERS)
      .read(user.id);

    expect(deletedUser).toBe(null);
    expect(nonDeletedAdmin).not.toBe(null);
  });

  async function testCreateSuperAdmin(userId: string, customErrorCodes?: CustomErrorCodes) {
    return testFunction(
      {},
      userId,
      (request, userId) => getAdminController().createSuperAdmin(request, userId),
      customErrorCodes
    );
  }

  async function testCreateAdmin(
    request: ICreateAdminRequest,
    userId: string,
    customErrorCodes?: CustomErrorCodes
  ) {
    return testFunction(
      request,
      userId,
      (request, userId) => getAdminController().createAdmin(request, userId),
      customErrorCodes
    );
  }
});
