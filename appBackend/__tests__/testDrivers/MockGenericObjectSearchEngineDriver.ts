import {
  CollectionNames,
  IGenericObjectSearchEngineDriver,
  ISearchEngineGenericObject,
  ISearchEngineRequestOptions,
  ISearchEngineResult,
} from '../../app/_adapters';

export class MockGenericObjectSearchEngineDriver<T extends ISearchEngineGenericObject>
  implements IGenericObjectSearchEngineDriver<T>
{
  private internalDB: Record<string, T> = {};

  constructor(readonly indexName: CollectionNames) {}

  public write<U extends T>(object: U): Promise<U> {
    this.internalDB[object.objectID] = object;

    return Promise.resolve(object);
  }

  public read(objectId: string): Promise<T | null> {
    return Promise.resolve(this.internalDB[objectId] ?? null);
  }

  public search(
    searchEngineRequestOptions: ISearchEngineRequestOptions
  ): Promise<ISearchEngineResult<T>> {
    return Promise.resolve({
      currentPage: searchEngineRequestOptions.currentPage,
      facets: {},
      results: [],
      totalResults: Object.values(this.internalDB).length,
    });
  }

  public delete(objectId: string): Promise<object> {
    delete this.internalDB[objectId];

    return Promise.resolve({ deleted: objectId });
  }
}
