import {
  CollectionNames,
  IGenericObjectSearchEngineDriver,
  IGenericObjectSearchEngineDriverFactory,
  ISearchEngineGenericObject,
} from '../../app/_adapters';
import { MockGenericObjectSearchEngineDriver } from './MockGenericObjectSearchEngineDriver';

export class MockGenericObjectSearchEngineDriverFactory
  implements IGenericObjectSearchEngineDriverFactory
{
  private internalDB: Record<string, IGenericObjectSearchEngineDriver<ISearchEngineGenericObject>> =
    {};

  generate<T extends ISearchEngineGenericObject>(
    collectionName: CollectionNames
  ): IGenericObjectSearchEngineDriver<T> {
    const genericObjectSearchEngineDriver = new MockGenericObjectSearchEngineDriver<T>(
      collectionName
    );

    this.internalDB[collectionName as string] =
      genericObjectSearchEngineDriver as IGenericObjectSearchEngineDriver<ISearchEngineGenericObject>;

    return genericObjectSearchEngineDriver;
  }

  getDB<T extends ISearchEngineGenericObject>(
    collectionName: CollectionNames
  ): IGenericObjectSearchEngineDriver<T> {
    return this.internalDB[collectionName as string] as IGenericObjectSearchEngineDriver<T>;
  }
}
