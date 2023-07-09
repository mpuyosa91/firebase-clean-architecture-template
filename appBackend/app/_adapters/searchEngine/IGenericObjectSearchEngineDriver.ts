import {
  CollectionNames,
  ISearchEngineGenericObject,
  ISearchEngineRequestOptions,
  ISearchEngineResult,
} from '../_useCases';

export const maxSearchEngineResultsPerPage = 1000;

export interface IGenericObjectSearchEngineDriver<T extends ISearchEngineGenericObject> {
  readonly indexName: CollectionNames;

  /**
   *
   * @param {U} object
   * @returns {Promise<U>}
   */
  write<U extends T>(object: U): Promise<U>;

  /**
   *
   * @param {string} objectId
   * @returns {Promise<T | null>}
   */
  read(objectId: string): Promise<T | null>;

  /**
   *
   * @param {ISearchEngineRequestOptions} searchEngineRequestOptions
   * @returns {Promise<ISearchEngineResult<T>>}
   */
  search(searchEngineRequestOptions: ISearchEngineRequestOptions): Promise<ISearchEngineResult<T>>;

  /**
   *
   * @param {string} objectId
   * @returns {Promise<object>}
   */
  delete(objectId: string): Promise<object>;
}
