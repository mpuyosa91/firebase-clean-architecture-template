import { CollectionNames, ISearchEngineGenericObject } from '../_useCases';
import { IGenericObjectSearchEngineDriver } from './IGenericObjectSearchEngineDriver';

export interface IGenericObjectSearchEngineDriverFactory {
  /**
   *
   * @param {CollectionNames} collectionName
   * @returns {IGenericObjectSearchEngineDriver<T>}
   */
  generate<T extends ISearchEngineGenericObject>(
    collectionName: CollectionNames
  ): IGenericObjectSearchEngineDriver<T>;
}
