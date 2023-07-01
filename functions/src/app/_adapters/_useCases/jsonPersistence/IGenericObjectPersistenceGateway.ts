import { IGenericObjectBasic } from '../_domain';
import { GetWhereConditionsType } from './_domain/GetWhereConditionsType';
import { IGetWhereOrderByType } from './_domain/IGetWhereOrderByType';

/**
 * Persistence gateway for generic objects.
 *
 * @template T - The type of the generic object.
 */
export interface IGenericObjectPersistenceGateway<T extends IGenericObjectBasic> {
  /**
   * Writes a generic object to the persistence layer.
   *
   * @param {T} object - The object to be written.
   * @returns {Promise<T>} A promise that resolves to the written object.
   * @throws {CustomError} If an error occurs during the write process.
   */
  write(object: T): Promise<T>;

  /**
   * Executes operations after writing a generic object to the persistence layer.
   *
   * @param {null | T} objectBefore
   * @param {T} objectAfter
   * @returns {Promise<T>}
   */
  afterWrite(objectBefore: null | T, objectAfter: T): Promise<Record<string, object>>;

  /**
   * Reads a generic object from the persistence layer based on the object ID.
   *
   * @param {string} objectId - The ID of the object to read.
   * @returns {Promise<T | null>} A promise that resolves to the read object, or null if not found.
   * @throws {CustomError} If an error occurs during the read process.
   */
  read(objectId: string): Promise<T | null>;

  /**
   * Retrieves an array of generic objects that match the specified conditions.
   *
   * @param {GetWhereConditionsType} conditions - The conditions used to filter the objects.
   * @param {IGetWhereOrderByType} [orderBy] - The ordering configuration for the retrieved objects.
   * @param {number} [limit] - The maximum number of objects to retrieve.
   * @returns {Promise<T[]>} A promise that resolves to an array of matching objects.
   * @throws {CustomError} If an error occurs during the retrieval process.
   */
  getWhere(
    conditions: GetWhereConditionsType,
    orderBy?: IGetWhereOrderByType,
    limit?: number
  ): Promise<T[]>;

  /**
   * Deletes a generic object from the persistence layer based on the object ID.
   *
   * @param {string} objectId - The ID of the object to delete.
   * @returns {Promise<object>} A promise that resolves when the object is deleted.
   * @throws {CustomError} If an error occurs during the deletion process.
   */
  delete(objectId: string): Promise<object>;

  /**
   * Executes operations after deleting a generic object from the persistence layer.
   *
   * @param {T} deletedObject
   * @returns {Promise<Record<string, object>>}
   */
  afterDelete(deletedObject: T): Promise<Record<string, object>>;
}
