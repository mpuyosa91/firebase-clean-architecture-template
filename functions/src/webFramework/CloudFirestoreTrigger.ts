import { Application, CollectionNames, IUser } from '../app';
import * as functions from 'firebase-functions';

export const onWriteUser = functions.firestore
  .document(`${CollectionNames.USERS}/{userId}`)
  .onWrite(async (snap, context) => {
    const userBefore = snap.before.exists ? (snap.before.data() as IUser) : null;
    const userAfter = snap.after.exists ? (snap.after.data() as IUser) : null;
    const userId = context.params.userId;

    return Application.getInstance()
      .getJsonViewPresenter()
      .jsonOrErrorResponse(
        'onWriteUser',
        { userId, userBefore, userAfter },
        Application.getInstance().getGenericUserController().onWriteUser
      );
  });
