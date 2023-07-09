import {
  checkWithEmail,
  checkWithIdRequest,
  checkWithPassword,
  checkWritableAdminRequest,
  DeepPartial,
  IWithEmail,
  IWithId,
  IWithPassword,
  IWritableAdmin,
  newFakeWithEmail,
  newFakeWithId,
  newFakeWithPassword,
  newFakeWritableAdmin,
  newWithEmail,
  newWithId,
  newWithPassword,
  newWritableAdmin,
  Validator,
} from '../../_useCases';

type ThisInterface = ICreateAdminRequest;
export const checkCreateAdminRequest = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): ThisInterface => {
  request.admin = Validator.validateExistence({ value: request.admin, name: 'admin', contextPath });

  return {
    admin: {
      ...checkWithIdRequest(request.admin, 'admin.'),
      ...checkWithEmail(request.admin, 'admin.'),
      ...checkWithPassword(request.admin, 'admin.'),
      ...checkWritableAdminRequest(request.admin, 'admin.'),
    },
  };
};

export const newCreateAdminRequest = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    admin: {
      ...newWithId(object?.admin),
      ...newWithEmail(object?.admin),
      ...newWithPassword(object?.admin),
      ...newWritableAdmin(object?.admin),
    },
  };

  return toReturnObject;
};

export interface ICreateAdminRequest {
  admin: IWithId & IWithEmail & IWithPassword & IWritableAdmin;
}

export const newFakeCreateAdminRequest = (params: { withAvatar?: boolean } = {}): ThisInterface => {
  return newCreateAdminRequest({
    admin: {
      ...newFakeWithId(),
      ...newFakeWithEmail(),
      ...newFakeWithPassword(),
      ...newFakeWritableAdmin(params),
    },
  });
};
