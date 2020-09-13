import { IUserIdentityExternalInterface } from '../app/userIdentity/adapters/IUserIdentityExternalInterface';
import {
  IUserIdentityDataEntity,
  IUserIdentityEntity,
  UserIdentityDataRoleEnum,
} from '../app/userIdentity/domain/UserIdentityEntity';
import { admin } from '../firebase';

// tslint:disable: object-literal-sort-keys
export class UserIdentityDriver implements IUserIdentityExternalInterface {
  private static defaultUserIdentityData: IUserIdentityDataEntity = {
    email: '',
    firstName: '',
    lastName: '',
  };

  public async getUser(userId: string): Promise<IUserIdentityEntity | null> {
    try {
      const firebaseUser = await admin.auth().getUser(userId);
      const customClaims =
        firebaseUser.customClaims || UserIdentityDriver.defaultUserIdentityData;
      const customClaimRole = customClaims.role as string;
      return {
        id: userId,
        role:
          UserIdentityDataRoleEnum[
            customClaimRole as keyof typeof UserIdentityDataRoleEnum
          ],
        data: {
          email: customClaims.email as string | '',
          firstName: customClaims.firstName as string | '',
          lastName: customClaims.lastName as string | '',
        },
      };
    } catch (err) {
      return null;
    }
  }

  public async checkUser(userId: string): Promise<boolean> {
    return (await this.getUser(userId)) !== null;
  }

  public async getDataOfUser(
    userId: string
  ): Promise<IUserIdentityDataEntity | null> {
    const user = await this.getUser(userId);
    if (user === null) {
      return null;
    }
    return user.data as IUserIdentityDataEntity;
  }

  public async setDataInUser(
    userId: string,
    data: IUserIdentityDataEntity
  ): Promise<void> {
    await admin.auth().setCustomUserClaims(userId, data);
  }
}
