// eslint-disable-file @typescript-eslint/no-unused-vars

import {
  Application,
  IUserCredentials,
  IUserIdentification,
  IUserIdentificationData,
  IUserIdentificationExternalInterfaceDriver,
  newUserIdentification,
} from '../../app';
import { cloneDeep } from 'lodash';

export class MockUserIdentificationExternalInterfaceDriver
  implements IUserIdentificationExternalInterfaceDriver
{
  private internalDB: Record<string, IUserIdentification> = {};

  public async createUser(
    userData: IUserCredentials,
    userDataClaims: IUserIdentificationData
  ): Promise<IUserIdentification> {
    if (Object.values(this.internalDB).find((uI) => uI.email === userData.email)) {
      throw new Error('The email address is already in use by another account');
    }

    const newUser: IUserIdentification = newUserIdentification({
      id: userDataClaims.id,
      email: userData.email,
      data: userDataClaims,
    });

    this.internalDB[userDataClaims.id] = newUser;

    await Application.getInstance()
      .getGenericUserController()
      .onCreateUser(
        { user: newUser, userId: userDataClaims.id },
        'MockUserIdentificationExternalInterfaceDriver'
      );

    return newUser;
  }

  public updateUser(
    userData: IUserCredentials,
    userDataClaims: IUserIdentificationData,
    userId: string
  ): Promise<IUserIdentification> {
    this.internalDB[userId] = newUserIdentification({
      id: userId,
      email: userData.email,
      data: userDataClaims,
    });

    return Promise.resolve(this.internalDB[userId]);
  }

  public generateEmailVerificationLink(_: string, __: string, ___: string): Promise<string> {
    return Promise.resolve('');
  }

  public getUser(userId: string): Promise<IUserIdentification | null> {
    return Promise.resolve(this.internalDB[userId] ?? null);
  }

  public getAllUsers(): Promise<IUserIdentification[]> {
    return Promise.resolve(Object.values(this.internalDB));
  }

  public getUserByEmail(email: string): Promise<IUserIdentification | null> {
    const userFound = Object.values(this.internalDB).find((user) => user.email === email);

    return Promise.resolve(userFound ?? null);
  }

  public setUserData(
    userId: string,
    data: IUserIdentificationData
  ): Promise<IUserIdentificationData> {
    if (this.internalDB[userId]) {
      this.internalDB[userId].data = data;
    }

    return Promise.resolve(data);
  }

  public generatePasswordResetLink(_: string, __: string, ___: string): Promise<string> {
    return Promise.resolve('');
  }

  public async deleteUser(userId: string): Promise<void> {
    const beforeDelete = cloneDeep(this.internalDB[userId]);

    delete this.internalDB[userId];

    await Application.getInstance()
      .getGenericUserController()
      .onDeleteUser(
        { user: beforeDelete, userId },
        'MockUserIdentificationExternalInterfaceDriver'
      );
  }
}
