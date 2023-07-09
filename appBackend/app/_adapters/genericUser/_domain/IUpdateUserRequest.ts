import {
  checkNonStrictWithEmail,
  checkNonStrictWithPassword,
  checkNonStrictWritableUser,
  DeepPartial,
} from '../../_useCases';
import { ICreateUserRequest, newFakeCreateUserRequest } from './ICreateUserRequest';

type ThisInterface = IUpdateUserRequest;

export const checkUpdateUserRequest = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): DeepPartial<ThisInterface> => {
  return {
    ...checkNonStrictWithEmail(request, contextPath),
    ...checkNonStrictWithPassword(request, contextPath),
    user: checkNonStrictWritableUser(request.user ?? {}, `${contextPath}.user`),
  };
};

export type IUpdateUserRequest = ICreateUserRequest;

export const newFakeUpdateUserRequest = (params: { withAvatar?: boolean } = {}): ThisInterface => {
  return {
    ...newFakeCreateUserRequest(params),
  };
};
