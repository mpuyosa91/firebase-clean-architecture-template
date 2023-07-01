import {
  CustomError,
  CustomErrorCodes,
  IUserCredentials,
  IUserIdentification,
  IUserIdentificationData,
  IUserIdentificationServiceGateway,
  newNullable,
  newUserIdentification,
  newUserIdentificationData,
} from '../_useCases';
import { IUserIdentificationExternalInterfaceDriver } from './IUserIdentificationExternalInterfaceDriver';

export class UserIdentificationServiceGatewayAdapter implements IUserIdentificationServiceGateway {
  constructor(
    private userIdentificationExternalInterfaceDriver: IUserIdentificationExternalInterfaceDriver
  ) {}

  public getUrl(): string {
    return this.userIdentificationExternalInterfaceDriver.isProduction()
      ? 'https://www.myapp.com/'
      : 'https://myapp-lab.web.app/';
  }

  public async createUser(
    userData: IUserCredentials,
    userDataClaims: IUserIdentificationData
  ): Promise<IUserIdentification> {
    let creationResult;

    try {
      creationResult = await this.userIdentificationExternalInterfaceDriver.createUser(
        userData,
        userDataClaims
      );
    } catch (err) {
      if (
        (err as Error).message.includes('The email address is already in use by another account')
      ) {
        throw new CustomError({
          code: CustomErrorCodes.USER_EXIST,
          message: `${(err as Error).message}. ${userData.email}`,
          reportAsError: false,
          status: 'already-exists',
        });
      }

      if ((err as Error).message.includes('The email address is improperly formatted')) {
        throw new CustomError({
          code: CustomErrorCodes.BAD_FORMAT_EMAIL,
          message: (err as Error).message,
          reportAsError: false,
          status: 'invalid-argument',
        });
      }

      throw new Error((err as Error).message);
    }

    return newUserIdentification(creationResult);
  }

  public async updateUser(
    userData: IUserCredentials,
    userDataClaims: IUserIdentificationData,
    userId: string
  ): Promise<IUserIdentification> {
    let updateResult;

    try {
      updateResult = await this.userIdentificationExternalInterfaceDriver.updateUser(
        userData,
        userDataClaims,
        userId
      );
    } catch (err) {
      if (
        (err as Error).message.includes('The email address is already in use by another account')
      ) {
        throw new CustomError({
          code: CustomErrorCodes.USER_EXIST,
          message: `${(err as Error).message}. ${userData.email}`,
          reportAsError: false,
          status: 'already-exists',
        });
      }

      if ((err as Error).message.includes('The email address is improperly formatted')) {
        throw new CustomError({
          code: CustomErrorCodes.BAD_FORMAT_EMAIL,
          message: (err as Error).message,
          reportAsError: false,
          status: 'invalid-argument',
        });
      }

      throw new Error((err as Error).message);
    }

    return newUserIdentification(updateResult);
  }

  public async getUser(userId: string): Promise<IUserIdentification | null> {
    let userIdentity: IUserIdentification | null = null;
    try {
      userIdentity = await this.userIdentificationExternalInterfaceDriver.getUser(userId);
    } catch (err) {
      throw new Error((err as Error).message);
    }

    return newNullable(newUserIdentification, userIdentity);
  }

  public async getUserByEmail(email: string): Promise<IUserIdentification | null> {
    let userIdentity: IUserIdentification | null = null;
    try {
      userIdentity = await this.userIdentificationExternalInterfaceDriver.getUserByEmail(email);
    } catch (err) {
      throw new Error((err as Error).message);
    }

    return newNullable(newUserIdentification, userIdentity);
  }

  public async getUserData(userId: string): Promise<IUserIdentificationData | null> {
    let userDataIdentity: IUserIdentificationData | null = null;
    try {
      userDataIdentity = await this.userIdentificationExternalInterfaceDriver.getUserData(userId);
    } catch (err) {
      throw new Error((err as Error).message);
    }

    return newNullable(newUserIdentificationData, userDataIdentity);
  }

  public async setUserData(
    userId: string,
    data: IUserIdentificationData
  ): Promise<IUserIdentificationData> {
    const validatedToUpdateUserData = newUserIdentificationData(data);

    try {
      await this.userIdentificationExternalInterfaceDriver.setUserData(
        userId,
        validatedToUpdateUserData
      );
    } catch (err) {
      throw new Error((err as Error).message);
    }

    return validatedToUpdateUserData;
  }

  public async generatePasswordResetLink(language: string, email: string): Promise<string> {
    return this.userIdentificationExternalInterfaceDriver.generatePasswordResetLink(
      language,
      email,
      this.getUrl()
    );
  }

  public async deleteUser(userId: string): Promise<void> {
    return this.userIdentificationExternalInterfaceDriver.deleteUser(userId);
  }
}
