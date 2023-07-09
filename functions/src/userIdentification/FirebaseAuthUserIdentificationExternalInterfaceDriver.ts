import {
  IUserCredentials,
  IUserIdentification,
  IUserIdentificationData,
  IUserIdentificationExternalInterfaceDriver,
  newUserIdentification,
} from 'appbackend';
import { UserRecord } from 'firebase-functions/v1/auth';
import { FirebaseError } from 'firebase-admin/lib/app/core';
import { FirebaseCloudFunctionsHelper } from '../jsonPresenter/FirebaseCloudFunctionsHelper';

/**
 * Blue Layer: Frameworks & Drivers (Drivers)
 */
export class FirebaseAuthUserIdentificationExternalInterfaceDriver
  implements IUserIdentificationExternalInterfaceDriver
{
  public readonly firebaseAuth = FirebaseCloudFunctionsHelper.getInstance().firebaseAuth;

  public async createUser(
    userData: IUserCredentials,
    userDataClaims: IUserIdentificationData
  ): Promise<IUserIdentification> {
    const firebaseAuth = this.firebaseAuth;

    const result = await firebaseAuth.createUser({
      uid: userDataClaims.id,
      email: userData.email,
      password: userData.password,
    });

    await this.setUserData(result.uid, userDataClaims);

    return (await this.getUser(result.uid)) ?? newUserIdentification();
  }

  public async updateUser(
    userData: IUserCredentials,
    userDataClaims: IUserIdentificationData,
    userId: string
  ): Promise<IUserIdentification> {
    const firebaseAuth = this.firebaseAuth;

    const result = await firebaseAuth.updateUser(userId, {
      email: userData.email,
      password: userData.password,
    });

    await this.setUserData(result.uid, userDataClaims);

    return (await this.getUser(result.uid)) ?? newUserIdentification();
  }

  public async generateEmailVerificationLink(
    language: string,
    email: string,
    url: string
  ): Promise<string> {
    const firebaseAuth = this.firebaseAuth;

    const actionCodeSettings = {
      handleCodeInApp: false,
      url,
    };

    const emailVerificationLink = await firebaseAuth.generateEmailVerificationLink(
      email,
      actionCodeSettings
    );

    const emailVerificationLinkArray = emailVerificationLink.split('?');
    emailVerificationLinkArray.splice(1, 0, '/confirmation');
    emailVerificationLinkArray[2] = `?${emailVerificationLinkArray[2]}&language=${language}`;

    return emailVerificationLinkArray.join('');
  }

  public async getUser(userId: string): Promise<IUserIdentification | null> {
    const firebaseAuth = this.firebaseAuth;

    try {
      const firebaseUser = await firebaseAuth.getUser(userId);
      return this.getUserIdentificationFromFirebaseUser(firebaseUser);
    } catch (err) {
      if ((err as FirebaseError).code === 'auth/user-not-found') {
        return null;
      }
      throw err;
    }
  }

  public async getAllUsers(): Promise<IUserIdentification[]> {
    return this.listAllUsers();
  }

  public async getUserByEmail(email: string): Promise<IUserIdentification | null> {
    const firebaseAuth = this.firebaseAuth;

    try {
      const firebaseUser = await firebaseAuth.getUserByEmail(email);
      return this.getUserIdentificationFromFirebaseUser(firebaseUser);
    } catch (err) {
      if ((err as FirebaseError).code === 'auth/user-not-found') {
        return null;
      }
      throw err;
    }
  }

  public async setUserData(
    userId: string,
    data: IUserIdentificationData
  ): Promise<IUserIdentificationData> {
    const firebaseAuth = this.firebaseAuth;

    await firebaseAuth.setCustomUserClaims(userId, data);

    return data;
  }

  public async generatePasswordResetLink(
    language: string,
    email: string,
    url: string
  ): Promise<string> {
    const firebaseAuth = this.firebaseAuth;

    const actionCodeSettings = {
      handleCodeInApp: false,
      url,
    };

    const resetPasswordLink = await firebaseAuth.generatePasswordResetLink(
      email,
      actionCodeSettings
    );

    const resetPasswordLinkArray = resetPasswordLink.split('?');
    resetPasswordLinkArray.splice(1, 0, '/reset-password');
    resetPasswordLinkArray[2] = `?${resetPasswordLinkArray[2]}&language=${language}`;

    return resetPasswordLinkArray.join('');
  }

  public async deleteUser(userId: string): Promise<void> {
    const firebaseAuth = this.firebaseAuth;

    await firebaseAuth.deleteUser(userId);
  }

  private getUserIdentificationFromFirebaseUser(firebaseUser: UserRecord): IUserIdentification {
    return newUserIdentification({
      data: firebaseUser.customClaims,
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified,
      id: firebaseUser.uid,
    });
  }

  private async listAllUsers(nextPageToken?: string): Promise<IUserIdentification[]> {
    const firebaseAuth = this.firebaseAuth;

    // List batch of users, 1000 at a time.
    try {
      const listUsersResult = await firebaseAuth.listUsers(1000, nextPageToken);

      let users: IUserIdentification[] = [];

      const firebaseUsers = listUsersResult.users;
      for (const firebaseUser of firebaseUsers) {
        users.push(this.getUserIdentificationFromFirebaseUser(firebaseUser));
      }

      if (listUsersResult.pageToken) {
        users = users.concat(await this.listAllUsers(listUsersResult.pageToken));
      }

      return users;
    } catch (e) {
      console.error('Error listing users:', e);
      return [];
    }
  }
}
