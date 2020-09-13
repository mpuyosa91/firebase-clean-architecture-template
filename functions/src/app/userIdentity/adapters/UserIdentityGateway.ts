import { IUserIdentityEntity } from '../domain/UserIdentityEntity';
import { IUserIdentityExternalInterface } from './IUserIdentityExternalInterface';
import { IUserIdentityGateway } from './IUserIdentityGateway';

export class UserIdentityGateway implements IUserIdentityGateway {
  constructor(
    private userIdentityExternalInterface: IUserIdentityExternalInterface
  ) {}

  public getUser(userId: string): Promise<IUserIdentityEntity | null> {
    try {
      return this.userIdentityExternalInterface.getUser(userId);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public async checkUser(userId: string): Promise<boolean> {
    try {
      return this.userIdentityExternalInterface.checkUser(userId);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public async getUserData(userId: string): Promise<any> {
    try {
      return await this.userIdentityExternalInterface.getDataOfUser(userId);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public async setUserData(userId: string, data: any): Promise<void> {
    try {
      await this.userIdentityExternalInterface.setDataInUser(userId, data);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
