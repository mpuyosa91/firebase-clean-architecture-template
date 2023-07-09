import {
  checkWritablePublicUser,
  IWritablePublicUser,
  newFakeWritablePublicUser,
  newWritablePublicUser,
} from '../genericUser';
import { DeepPartial } from '../genericObject';

type ThisInterface = IWritablePublicAdmin;

export const checkWritablePublicAdminRequest = (
  request: DeepPartial<ThisInterface>
): ThisInterface => ({
  ...checkWritablePublicUser(request),
});

export const newWritablePublicAdmin = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newWritablePublicUser(object),
  };

  return toReturnObject;
};

export type IWritablePublicAdmin = IWritablePublicUser;

export const newFakeWritablePublicAdmin = (
  params: { withAvatar?: boolean } = {}
): ThisInterface => {
  return newWritablePublicAdmin({
    ...newFakeWritablePublicUser(params),
  });
};
