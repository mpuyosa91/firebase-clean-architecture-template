import { DeepPartial } from '../genericObject';
import { IAdmin, newAdmin } from '../adminUser';
import { ISearchEngineUser, newSearchEngineUser } from './ISearchEngineUser';

type ThisInterface = ISearchEngineAdmin;
export const newSearchEngineAdmin = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newSearchEngineUser(object),
    ...newAdmin(object),
  };

  return toReturnObject;
};

export interface ISearchEngineAdmin extends ISearchEngineUser, IAdmin {}
