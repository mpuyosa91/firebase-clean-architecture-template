import {
  IGenericObjectBasic,
  IGenericObjectPersistenceDriver,
  IGenericObjectPersistenceDriverFactory,
} from 'appbackend';
import { FirestoreGenericObjectPersistenceDriver } from './FirestoreGenericObjectPersistenceDriver';

export class FirestoreGenericObjectPersistenceDriverFactory
  implements IGenericObjectPersistenceDriverFactory
{
  public generate<T extends IGenericObjectBasic>(
    collectionName: string
  ): IGenericObjectPersistenceDriver<T> {
    return new FirestoreGenericObjectPersistenceDriver<T>(collectionName);
  }
}
