import {
  CollectionNames,
  IGenericObjectBasic,
  IGenericObjectPersistenceDriver,
  IGenericObjectPersistenceDriverFactory,
} from '../../app/_adapters';
import { MockGenericObjectPersistenceDriver } from './MockGenericObjectPersistenceDriver';

export class MockGenericObjectPersistenceDriverFactory
  implements IGenericObjectPersistenceDriverFactory
{
  private internalDB: Record<string, IGenericObjectPersistenceDriver<IGenericObjectBasic>> = {};

  generate<T extends IGenericObjectBasic>(
    collectionName: CollectionNames
  ): IGenericObjectPersistenceDriver<T> {
    const genericObjectPersistenceDriver = new MockGenericObjectPersistenceDriver<T>(
      collectionName
    );

    this.internalDB[collectionName as string] =
      genericObjectPersistenceDriver as IGenericObjectPersistenceDriver<IGenericObjectBasic>;

    return genericObjectPersistenceDriver;
  }

  getDB(collectionName: CollectionNames) {
    return this.internalDB[collectionName as string];
  }
}
