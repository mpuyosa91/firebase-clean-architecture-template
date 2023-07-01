import { ISearchable, newSearchable } from './ISearchable';
import { DeepPartial, IGenericObject, newGenericObject } from '../genericObject';

type ThisInterface = ISearchEngineGenericObject;
export const newSearchEngineGenericObject = (
  object?: DeepPartial<ThisInterface>
): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newSearchable(object),
    ...newGenericObject(object),
  };

  toReturnObject.objectID = toReturnObject.id;

  return toReturnObject;
};

export interface ISearchEngineGenericObject extends ISearchable, IGenericObject {}
