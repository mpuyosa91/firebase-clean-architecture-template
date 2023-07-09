import {
  checkWithEmail,
  checkWithPassword,
  checkWritableUser,
  DeepPartial,
  IWithEmail,
  IWithPassword,
  IWritableUser,
  newFakeWithEmail,
  newFakeWithPassword,
  newFakeWritableUser,
} from '../../_useCases';

type ThisInterface = ICreateUserRequest;

export const checkCreateUserRequest = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): ThisInterface => {
  return {
    ...checkWithEmail(request, contextPath),
    ...checkWithPassword(request, contextPath),
    user: checkWritableUser(request.user ?? {}, `${contextPath}.user`),
  };
};

export interface ICreateUserRequest extends IWithEmail, IWithPassword {
  user: IWritableUser;
}

export const newFakeCreateUserRequest = (params: { withAvatar?: boolean } = {}): ThisInterface => {
  return {
    ...newFakeWithEmail(),
    ...newFakeWithPassword(),
    user: newFakeWritableUser(params),
  };
};
