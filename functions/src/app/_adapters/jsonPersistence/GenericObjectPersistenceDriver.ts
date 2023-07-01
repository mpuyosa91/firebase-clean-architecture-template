import {
  CustomDate,
  CustomError,
  CustomErrorCodes,
  IGenericObject,
} from '../_useCases';
import { cloneDeep } from 'lodash';
import { ISearchEngineRequestOptions } from './_domain/ISearchEngineRequestOptions';
import { IGetWhereOrderByType } from './_domain/IGetWhereOrderByType';
import { GetWhereConditionsType } from './_domain/GetWhereConditionsType';

export abstract class GenericObjectPersistenceDriver<T extends IGenericObject> {
  constructor(protected collectionName: string) {}

  /**
   *
   * @param {U} object
   * @returns {Promise<U>}
   */
  public async write<U extends T>(object: U): Promise<U> {
    const objectId = object.id;
    const objectType = object.objectType;
    object.updatedAtBySystem = new CustomDate().toIsoString();

    try {
      return cloneDeep(await this.externalWrite(object));
    } catch (e) {
      throw new CustomError({
        code: CustomErrorCodes.ERROR_IN_OBJECT_WRITE,
        message: `Error writing object with id ${objectId} and type ${objectType}.`,
        payload: {
          collectionName: this.collectionName,
          error: e,
          object,
        },
        reportAsError: true,
        status: 'unknown',
      });
    }
  }

  /**
   *
   * @param {string} objectId
   * @returns {Promise<T | null>}
   */
  public async read(objectId: string): Promise<T | null> {
    try {
      return cloneDeep(await this.externalRead(objectId));
    } catch (e) {
      throw new CustomError({
        code: CustomErrorCodes.ERROR_IN_OBJECT_READ,
        message: `Error reading object with id ${objectId}.`,
        payload: {
          collectionName: this.collectionName,
          error: e,
          objectId,
        },
        reportAsError: true,
        status: 'unknown',
      });
    }
  }

  /**
   *
   * @param {GetWhereConditionsType} conditions
   * @param {IGetWhereOrderByType} orderBy
   * @param {number} limit
   * @returns {Promise<T[]>}
   */
  public async getWhere(
    conditions: GetWhereConditionsType,
    orderBy?: IGetWhereOrderByType,
    limit?: number
  ): Promise<T[]> {
    try {
      return cloneDeep(await this.externalGetWhere(conditions, orderBy, limit));
    } catch (e) {
      throw new CustomError({
        code: CustomErrorCodes.ERROR_IN_OBJECT_MASSIVE_READ,
        message: `Error reading objects.`,
        payload: {
          collectionName: this.collectionName,
          error: e,
          conditions,
          orderBy,
          limit,
        },
        reportAsError: true,
        status: 'unknown',
      });
    }
  }

  /**
   *
   * @param {string} objectId
   * @returns {Promise<object>}
   */
  public async delete(objectId: string): Promise<object> {
    try {
      return cloneDeep(await this.externalDelete(objectId));
    } catch (e) {
      throw new CustomError({
        code: CustomErrorCodes.ERROR_IN_OBJECT_DELETE,
        message: `Error deleting object with id ${objectId}.`,
        payload: {
          collectionName: this.collectionName,
          error: e,
          objectId,
        },
        reportAsError: true,
        status: 'unknown',
      });
    }
  }

  /**
   *
   * @param {ISearchEngineRequestOptions} searchEngineRequestOptions
   * @returns {Promise<{results: T[], currentPage: number, totalResults: number}>}
   */
  public abstract getByPagination(
    searchEngineRequestOptions: ISearchEngineRequestOptions
  ): Promise<{ results: T[]; currentPage: number; totalResults: number }>;

  /**
   *
   * @param {GetWhereConditionsType} conditions
   * @param {IGetWhereOrderByType} orderBy
   * @param {number} limit
   * @returns {Promise<T[]>}
   */
  public abstract externalGetWhere(
    conditions: GetWhereConditionsType,
    orderBy?: IGetWhereOrderByType,
    limit?: number
  ): Promise<T[]>;

  /**
   *
   * @param {string} objectId
   * @returns {Promise<T | null>}
   * @protected
   */
  protected abstract externalRead(objectId: string): Promise<T | null>;

  /**
   *
   * @param {U} object
   * @returns {Promise<U>}
   * @protected
   */
  protected abstract externalWrite<U extends T>(object: U): Promise<U>;

  /**
   *
   * @param {string} objectId
   * @returns {Promise<object>}
   * @protected
   */
  protected abstract externalDelete(objectId: string): Promise<object>;
}
