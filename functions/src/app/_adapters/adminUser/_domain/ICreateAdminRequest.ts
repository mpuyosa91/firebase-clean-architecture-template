import {
  checkWithEmailRequest,
  checkWithIdRequest,
  checkWithPasswordRequest,
  checkWritableAdminRequest,
  DeepPartial,
  IWithEmail,
  IWithId,
  IWithPassword,
  IWritableAdmin,
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
      ...checkWithEmailRequest(request.admin, 'admin.'),
      ...checkWithPasswordRequest(request.admin, 'admin.'),
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
