import {
  CollectionNames,
  IGenericObjectSearchEngineDriver,
  IGenericObjectSearchEngineDriverFactory,
  ISearchEngineGenericObject,
} from 'appbackend';
import { AlgoliaGenericObjectSearchEngineDriver } from './AlgoliaGenericObjectSearchEngineDriver';

export class AlgoliaGenericObjectSearchEngineDriverFactory
  implements IGenericObjectSearchEngineDriverFactory
{
  public generate<T extends ISearchEngineGenericObject>(
    collectionName: CollectionNames
  ): IGenericObjectSearchEngineDriver<T> {
    return new AlgoliaGenericObjectSearchEngineDriver<T>(collectionName);
  }
}
