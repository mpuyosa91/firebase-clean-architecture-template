import {
  CollectionNames,
  GetWhereConditionsType,
  IGenericObjectBasic,
  IGetWhereOrderByType,
  ISearchEngineRequestOptions,
} from '../_useCases';

export interface IGenericObjectPersistenceDriver<T extends IGenericObjectBasic> {
  readonly collectionName: CollectionNames;

  /**
   *
   * @param {U} object
   * @returns {Promise<U>}
   * @protected
   */
  write<U extends T>(object: U): Promise<U>;

  /**
   *
   * @param {string} objectId
   * @returns {Promise<T | null>}
   * @protected
   */
  read(objectId: string): Promise<T | null>;

  /**
   *
   * @param {GetWhereConditionsType} conditions
   * @param {IGetWhereOrderByType} orderBy
   * @param {number} limit
   * @returns {Promise<T[]>}
   */
  getWhere(
    conditions: GetWhereConditionsType,
    orderBy?: IGetWhereOrderByType,
    limit?: number
  ): Promise<T[]>;

  /**
   *
   * @param {ISearchEngineRequestOptions} searchEngineRequestOptions
   * @returns {Promise<{results: T[], currentPage: number, totalResults: number}>}
   */
  getByPagination(
    searchEngineRequestOptions: ISearchEngineRequestOptions
  ): Promise<{ results: T[]; currentPage: number; totalResults: number }>;

  /**
   *
   * @param {string} objectId
   * @returns {Promise<object>}
   * @protected
   */
  delete(objectId: string): Promise<object>;
}
