import {
  checkNonStrictWritablePublicUser,
  checkWritablePublicUser,
  IWritablePublicUser,
  newFakeWritablePublicUser,
  newWritablePublicUser,
} from './IWritablePublicUser';
import {
  DeepPartial,
  IWritableGenericObject,
  newFakeWritableGenericObject,
  newWritableGenericObject,
} from '../genericObject';

type ThisInterface = IWritableUser;

export const checkNonStrictWritableUser = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): DeepPartial<ThisInterface> => ({
  ...checkNonStrictWritablePublicUser(request, contextPath),
});

export const checkWritableUser = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): ThisInterface => ({
  ...checkWritablePublicUser(request, contextPath),
});

export const newWritableUser = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newWritableGenericObject(object),
    ...newWritablePublicUser(object),
  };

  return toReturnObject;
};

export interface IWritableUser extends IWritableGenericObject, IWritablePublicUser {}

export const newFakeWritableUser = (params: { withAvatar?: boolean } = {}): ThisInterface => {
  return newWritableUser({
    ...newFakeWritableGenericObject(),
    ...newFakeWritablePublicUser(params),
  });
};
