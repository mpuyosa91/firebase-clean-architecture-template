import { IGenericObjectBasic } from '../_useCases';
import { IGenericObjectPersistenceDriver } from './IGenericObjectPersistenceDriver';

export interface IGenericObjectPersistenceDriverFactory {
  /**
   *
   * @param {string} collectionName
   * @returns {IGenericObjectPersistenceDriver<T>}
   */
  generate<T extends IGenericObjectBasic>(
    collectionName: string
  ): IGenericObjectPersistenceDriver<T>;
}
