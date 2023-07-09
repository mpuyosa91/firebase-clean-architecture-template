import {
  CustomError,
  CustomErrorCodes,
  ICreateAdminRequest,
  newFakeCreateAdminRequest,
} from '../app';
import { getAdminController, getSuperAdminId } from './testDrivers/CreateMockApplication';

describe('AdminController', () => {
  test('AUC001. Create Super Admin', async () => {
    await testCreateSuperAdmin('');
  });

  test('AUC001_1. Can not create two Super Admin', async () => {
    await testCreateSuperAdmin('', CustomErrorCodes.SUPER_ADMIN_ALREADY_EXISTS);
  });

  test('AUC002. Create Admin', async () => {
    const superAdminId = await getSuperAdminId();

    const request = newFakeCreateAdminRequest();

    await testCreateAdmin(request, superAdminId);
  });

  test('AUC002_1. Only Super Admin can create Admins', async () => {
    const superAdminId = await getSuperAdminId();

    const request = newFakeCreateAdminRequest();

    const response = await getAdminController().createAdmin(request, superAdminId);

    await testCreateAdmin(request, response.adminDocument.id, CustomErrorCodes.MISSING_PRIVILEGES);
  });

  test('AUC002_2. Can not create two admins with the same email', async () => {
    const superAdminId = await getSuperAdminId();

    const request = newFakeCreateAdminRequest();

    const response = await getAdminController().createAdmin(request, superAdminId);

    await testCreateAdmin(request, response.adminDocument.id, CustomErrorCodes.MISSING_PRIVILEGES);
  });

  async function testCreateSuperAdmin(userId: string, customErrorCodes?: CustomErrorCodes) {
    try {
      const response = await getAdminController().createSuperAdmin({}, userId);

      !customErrorCodes ? expect(response.adminUser).toBeTruthy() : expect(response).toBeFalsy();

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

  async function testCreateAdmin(
    request: ICreateAdminRequest,
    userId: string,
    customErrorCodes?: CustomErrorCodes
  ) {
    try {
      const response = await getAdminController().createAdmin(request, userId);

      !customErrorCodes ? expect(response.adminUser).toBeTruthy() : expect(response).toBeFalsy();

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
