import { IGenericObject } from '../_useCases';
import { GenericObjectPersistenceDriver } from './GenericObjectPersistenceDriver';

export interface IGenericObjectPersistenceDriverFactory {
  /**
   *
   * @param {string} collectionName
   * @returns {GenericObjectPersistenceDriver<T>}
   */
  generate<T extends IGenericObject>(
    collectionName: string
  ): GenericObjectPersistenceDriver<T>;
}
