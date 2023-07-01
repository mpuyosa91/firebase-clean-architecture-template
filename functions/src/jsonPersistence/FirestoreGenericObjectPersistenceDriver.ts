import {
  CustomDate,
  IGenericObjectPersistenceDriver,
  GetWhereConditionsType,
  IGenericObjectBasic,
  IGetWhereOrderByType,
  ISearchEngineRequestOptions,
} from '../app';
import { getDB } from '../firebase';
import { firestore } from 'firebase-admin';

/**
 * Blue Layer: Frameworks & Drivers (Drivers)
 */
export class FirestoreGenericObjectPersistenceDriver<T extends IGenericObjectBasic>
  implements IGenericObjectPersistenceDriver<T>
{
  private maxResultsPerPage = 1000;
  private minResultsPerPage = 5;
  private minCurrentPage = 0;
  private cacheValidationWindow = 20 * 60 * 1000; // 20 min in mSec
  private indexSortByKey = 'createdAt' as const;
  private indexSortByDirection: firestore.OrderByDirection = 'desc';
  private indexer: {
    [orderBy: string]: { createdAt: string; index: string[] };
  } = {};

  constructor(public readonly collectionName: string) {}

  public async write<U extends T>(object: U): Promise<U> {
    const db = await getDB();

    await db.collection(this.collectionName).doc(object.id).set(object);

    return object;
  }

  public async read(objectId: string): Promise<T | null> {
    const db = await getDB();

    const documentData = await db.collection(this.collectionName).doc(objectId).get();
    if (!documentData.exists) {
      return null;
    }

    return this.documentMapper(documentData);
  }

  public async getByPagination(
    searchEngineRequestOptions: ISearchEngineRequestOptions
  ): Promise<{ results: T[]; currentPage: number; totalResults: number }> {
    const db = await getDB();

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

    const querySnapshot = await db
      .collection(this.collectionName)
      .orderBy(this.indexSortByKey, this.indexSortByDirection)
      .startAt(this.indexer[this.indexSortByKey].index[from])
      .endAt(this.indexer[this.indexSortByKey].index[toPlusOne - 1])
      .get();

    const result: T[] = [];
    querySnapshot.forEach((doc) => result.push(this.documentMapper(doc)));

    return { results: result, currentPage, totalResults };
  }

  public async getWhere(
    conditions: GetWhereConditionsType,
    orderBy?: IGetWhereOrderByType,
    limit?: number
  ): Promise<T[]> {
    const db = await getDB();

    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = db.collection(
      this.collectionName
    );

    for (const condition of conditions) {
      query = query.where(
        condition.property,
        condition.comparison as FirebaseFirestore.WhereFilterOp,
        condition.valueToCompare
      );
    }

    if (orderBy) {
      query = query.orderBy(orderBy.property, orderBy.direction);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const querySnapshot = await query.get();

    const result: T[] = [];
    querySnapshot.forEach((doc) => result.push(this.documentMapper(doc)));

    return result;
  }

  public async delete(objectId: string): Promise<object> {
    const db = await getDB();

    return db.collection(this.collectionName).doc(objectId).delete();
  }

  private documentMapper = (
    documentData: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
  ): T => {
    const document = documentData.data() as T;
    document.id = documentData.id;
    return document;
  };

  private async checkCreateAtIndex() {
    const db = await getDB();
    const now = new CustomDate();

    const cacheValidUntil = new CustomDate(
      now.getTime() - this.cacheValidationWindow
    ).toIsoString();

    if (this.indexer[this.indexSortByKey]?.createdAt >= cacheValidUntil) {
      return;
    }

    const indexDocumentsData = await db
      .collection(this.collectionName)
      .orderBy(this.indexSortByKey, this.indexSortByDirection)
      .get();

    this.indexer[this.indexSortByKey] = {
      createdAt: now.toIsoString(),
      index: [],
    };
    indexDocumentsData.forEach((doc) => {
      this.indexer[this.indexSortByKey].index.push(this.documentMapper(doc)[this.indexSortByKey]);
    });
  }
}
