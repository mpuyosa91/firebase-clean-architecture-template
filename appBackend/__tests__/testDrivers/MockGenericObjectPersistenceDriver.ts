// eslint-disable-file @typescript-eslint/no-explicit-any

import {
  Application,
  CollectionNames,
  CustomDate,
  GetWhereConditionsType,
  IGenericObjectBasic,
  IGenericObjectPersistenceDriver,
  IGetWhereOrderByType,
  ISearchEngineRequestOptions,
  ObjectTypesEnum,
} from '../../app';
import { cloneDeep } from 'lodash';

export class MockGenericObjectPersistenceDriver<T extends IGenericObjectBasic>
  implements IGenericObjectPersistenceDriver<T>
{
  private maxResultsPerPage = 1000;
  private minResultsPerPage = 5;
  private minCurrentPage = 0;
  private cacheValidationWindow = 20 * 60 * 1000; // 20 min in mSec
  private indexSortByKey = 'createdAt' as const;
  private indexSortByDirection = 'desc';
  private indexer: {
    [orderBy: string]: { createdAt: string; index: string[] };
  } = {};
  private internalDB: Record<string, T> = {};

  private documentMapper = (documentData: T): T => {
    return documentData;
  };
  constructor(public readonly collectionName: CollectionNames) {}

  public async write<U extends T>(object: U): Promise<U> {
    const objectBefore = this.internalDB[object.id] ? cloneDeep(this.internalDB[object.id]) : null;
    this.internalDB[object.id] = object;
    const objectAfter = cloneDeep(this.internalDB[object.id]);

    await this.onWriteObject(object.id, objectBefore, objectAfter);

    return object;
  }

  public read(objectId: string): Promise<T | null> {
    return Promise.resolve(this.internalDB[objectId] ?? null);
  }

  public async getByPagination(searchEngineRequestOptions: ISearchEngineRequestOptions): Promise<{
    results: T[];
    currentPage: number;
    totalResults: number;
  }> {
    await this.checkCreateAtIndex();

    const totalResults = this.indexer[this.indexSortByKey].index.length;
    if (totalResults === 0) {
      return { results: [], currentPage: 0, totalResults };
    }

    const resultsPerPage = Math.min(
      Math.max(searchEngineRequestOptions.resultsPerPage, this.minResultsPerPage),
      this.maxResultsPerPage
    );
    const currentPage = Math.min(
      Math.max(searchEngineRequestOptions.currentPage, this.minCurrentPage),
      Math.ceil(totalResults / resultsPerPage) - 1
    );

    const from = resultsPerPage * currentPage;
    const toPlusOne = Math.min(resultsPerPage * (currentPage + 1), totalResults);

    const querySnapshot = this.sortItems(
      Object.values(this.internalDB),
      this.indexSortByKey,
      this.indexSortByDirection
    ).slice(from, toPlusOne - 1);

    const result: T[] = [];
    querySnapshot.forEach((doc) => result.push(this.documentMapper(doc)));

    return { results: result, currentPage, totalResults };
  }

  public async delete(objectId: string): Promise<object> {
    const objectBefore = this.internalDB[objectId] ? cloneDeep(this.internalDB[objectId]) : null;
    delete this.internalDB[objectId];

    await this.onWriteObject(objectId, objectBefore, null);

    return { deleted: objectId };
  }

  public async getWhere(
    conditions: GetWhereConditionsType,
    orderBy?: IGetWhereOrderByType,
    limit?: number
  ): Promise<T[]> {
    const db = this.internalDB;

    let query: Array<T> = Object.values(db);

    for (const condition of conditions) {
      query = query.filter((item) =>
        this.compareValues(
          item[condition.property as keyof T] as unknown as object,
          condition.valueToCompare as unknown as object,
          condition.comparison
        )
      );
    }

    if (orderBy) {
      query = this.sortItems(query, orderBy.property as keyof T, orderBy.direction);
    }

    if (limit) {
      query = query.slice(0, limit);
    }

    return query;
  }

  private compareValues(value: object, valueToCompare: object, comparison: string): boolean {
    // Implement your comparison logic here based on the given comparison operator
    // Example implementation:
    switch (comparison) {
      case '==':
        return value === valueToCompare;
      case '>':
        return value > valueToCompare;
      case '>=':
        return value >= valueToCompare;
      case '<':
        return value < valueToCompare;
      case '<=':
        return value <= valueToCompare;
      default:
        return false;
    }
  }

  private sortItems(items: Array<T>, property: keyof T, direction: string): Array<T> {
    // Implement your sorting logic here based on the given property and direction
    // Example implementation:
    return items.sort((a, b) => {
      if (a[property] < b[property]) {
        return direction === 'asc' ? -1 : 1;
      } else if (a[property] > b[property]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  private async checkCreateAtIndex() {
    const now = new CustomDate();

    const cacheValidUntil = new CustomDate(
      now.getTime() - this.cacheValidationWindow
    ).toIsoString();

    if (this.indexer[this.indexSortByKey]?.createdAt >= cacheValidUntil) {
      return;
    }

    const indexDocumentsData = this.sortItems(
      Object.values(this.internalDB),
      this.indexSortByKey,
      this.indexSortByDirection
    );

    this.indexer[this.indexSortByKey] = {
      createdAt: now.toIsoString(),
      index: [],
    };
    indexDocumentsData.forEach((doc) => {
      this.indexer[this.indexSortByKey].index.push(this.documentMapper(doc)[this.indexSortByKey]);
    });
  }

  private async onWriteObject(
    objectId: string,
    objectBefore: T | null,
    objectAfter: T | null
  ): Promise<unknown> {
    const requestObject = {
      objectId,
      objectBefore,
      objectAfter,
    };

    const objectType = objectAfter?.objectType ?? objectBefore?.objectType ?? ObjectTypesEnum.NONE;

    switch (objectType) {
      case ObjectTypesEnum.ADMIN:
      case ObjectTypesEnum.USER:
        return Application.getInstance()
          .getGenericUserController()
          .onWriteObject(requestObject, 'MockGenericObjectPersistenceDriver');
    }
  }
}
