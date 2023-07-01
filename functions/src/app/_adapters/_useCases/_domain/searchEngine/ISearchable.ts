import { DeepPartial } from '../genericObject';

type ThisInterface = ISearchable;
export const newSearchable = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    imageURL: object?.imageURL ?? '',
    objectID: object?.objectID ?? '',
  };

  return toReturnObject;
};

export interface ISearchable {
  objectID: string;

  imageURL: string;
}
