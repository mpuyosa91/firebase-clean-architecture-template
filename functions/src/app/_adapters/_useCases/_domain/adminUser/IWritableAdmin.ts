import { checkWritablePublicGenericObjectRequest, DeepPartial } from '../genericObject';
import {
  IWritablePublicAdmin,
  newFakeWritablePublicAdmin,
  newWritablePublicAdmin,
} from './IWritablePublicAdmin';
import {
  checkWritablePublicUserRequest,
  IWritableUser,
  newFakeWritableUser,
  newWritableUser,
} from '../genericUser';

type ThisInterface = IWritableAdmin;

export const checkWritableAdminRequest = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): ThisInterface => ({
  ...checkWritablePublicGenericObjectRequest(request, contextPath),
  ...checkWritablePublicUserRequest(request, contextPath),
});

export const newWritableAdmin = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newWritableUser(object),
    ...newWritablePublicAdmin(object),
  };

  return toReturnObject;
};

export interface IWritableAdmin extends IWritableUser, IWritablePublicAdmin {}

export const newFakeWritableAdmin = (params: { withAvatar?: boolean } = {}): ThisInterface => {
  return newWritableAdmin({
    ...newFakeWritableUser(params),
    ...newFakeWritablePublicAdmin(params),
  });
};
