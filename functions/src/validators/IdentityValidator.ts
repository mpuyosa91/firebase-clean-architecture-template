import { CallableContext } from "firebase-functions/lib/providers/https";
import { IUserIdentityEntity } from "../app/userIdentity/domain/UserIdentityEntity";

import { functions } from "../firebase";
import { UserIdentityDriver } from "../userIdentity/UserIdentityDriver";

export class IdentityValidator {
  public static userIdentityDriver = new UserIdentityDriver();

  public static async executeIfAuthorizedAndManageErrorsIf(
    callback: (user: IUserIdentityEntity) => any,
    context: CallableContext
  ) {
    try {
      const user = context.auth;
      if (context.auth === null || context.auth === undefined) {
        throw new functions.https.HttpsError(
          "permission-denied",
          "Not Authorized"
        );
      }

      const userIdentity = await IdentityValidator.userIdentityDriver.getUser(
        user!.uid
      );

      return await callback(userIdentity!);
    } catch (err) {
      if (err instanceof Error) {
        throw new functions.https.HttpsError("invalid-argument", err.message);
      }
      if (err instanceof functions.https.HttpsError) {
        throw err;
      }
      throw new functions.https.HttpsError("internal", err);
    }
  }
}
