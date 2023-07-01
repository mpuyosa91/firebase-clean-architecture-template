import { IUser, newUser } from '../genericUser';
import { DeepPartial } from '../genericObject';
import {
  ISearchEngineGenericObject,
  newSearchEngineGenericObject,
} from './ISearchEngineGenericObject';

type ThisInterface = ISearchEngineUser;
export const newSearchEngineUser = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newSearchEngineGenericObject(object),
    ...newUser(object),
  };

  toReturnObject.imageURL = toReturnObject.avatarUrl ?? '';

  return toReturnObject;
};

export interface ISearchEngineUser extends ISearchEngineGenericObject, IUser {}
