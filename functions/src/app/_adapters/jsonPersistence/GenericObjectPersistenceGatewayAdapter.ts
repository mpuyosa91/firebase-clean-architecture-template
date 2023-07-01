import {
  CustomDate,
  CustomError,
  CustomErrorCodes,
  GetWhereConditionsType,
  IGenericObjectBasic,
  IGenericObjectPersistenceGateway,
  IGenericObjectSearchEngineGateway,
  IGetWhereOrderByType,
  ISearchEngineGenericObject,
  newSearchEngineAdmin,
  newSearchEngineGenericObject,
  newSearchEngineUser,
  newUpdatableBySystem,
  ObjectTypesEnum,
} from '../_useCases';
import { IGenericObjectPersistenceDriver } from './IGenericObjectPersistenceDriver';

/**
 * Adapter for the persistence gateway of generic objects.
 *
 * @template T - The type of the generic object.
 * @template R - The type of the search engine generic object.
 */
export class GenericObjectPersistenceGatewayAdapter<
  T extends IGenericObjectBasic,
  R extends ISearchEngineGenericObject
> implements IGenericObjectPersistenceGateway<T>
{
  constructor(
    private genericObjectPersistenceDriver: IGenericObjectPersistenceDriver<T>,
    private genericObjectSearchEngineGateway?: IGenericObjectSearchEngineGateway<R>
  ) {}

  public async write(object: T): Promise<T> {
    try {
      return await this.genericObjectPersistenceDriver.write({
        ...object,
        ...newUpdatableBySystem({
          updatedAtBySystem: new CustomDate().toIsoString(),
        }),
      });
    } catch (e) {
      throw new CustomError({
        code: CustomErrorCodes.ERROR_IN_OBJECT_WRITE,
        message: `Error writing object with id ${object.id} and type ${object.objectType}.`,
        payload: {
          collectionName: this.genericObjectPersistenceDriver.collectionName,
          error: e,
          object,
        },
        reportAsError: true,
        status: 'unknown',
      });
    }
  }

  public async afterWrite(objectBefore: null | T, objectAfter: T): Promise<Record<string, object>> {
    const afterWriteObjectResult: Record<string, object> = {};

    if (this.genericObjectSearchEngineGateway) {
      if (objectAfter.enabled) {
        let searchEngineObject: R;

        switch (objectAfter.objectType) {
          case ObjectTypesEnum.ADMIN:
            searchEngineObject = newSearchEngineAdmin(objectAfter) as unknown as R;
            break;
          case ObjectTypesEnum.USER:
            searchEngineObject = newSearchEngineUser(objectAfter) as unknown as R;
            break;
          default:
            searchEngineObject = newSearchEngineGenericObject(objectAfter) as unknown as R;
        }

        afterWriteObjectResult['searchEngineUpdateResult'] =
          await this.genericObjectSearchEngineGateway.write(searchEngineObject);
      } else {
        afterWriteObjectResult['searchEngineDeletionResult'] =
          await this.genericObjectSearchEngineGateway.delete(objectAfter.id);
      }
    }

    return afterWriteObjectResult;
  }

  public async read(objectId: string): Promise<T | null> {
    try {
      return await this.genericObjectPersistenceDriver.read(objectId);
    } catch (e) {
      throw new CustomError({
        code: CustomErrorCodes.ERROR_IN_OBJECT_READ,
        message: `Error reading object with id ${objectId}.`,
        payload: {
          collectionName: this.genericObjectPersistenceDriver.collectionName,
          error: e,
          objectId,
        },
        reportAsError: true,
        status: 'unknown',
      });
    }
  }

  public async getWhere(
    conditions: GetWhereConditionsType,
    orderBy?: IGetWhereOrderByType,
    limit?: number
  ): Promise<T[]> {
    try {
      return await this.genericObjectPersistenceDriver.getWhere(conditions, orderBy, limit);
    } catch (e) {
      throw new CustomError({
        code: CustomErrorCodes.ERROR_IN_OBJECT_MASSIVE_READ,
        message: `Error reading objects.`,
        payload: {
          collectionName: this.genericObjectPersistenceDriver.collectionName,
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

  public async delete(objectId: string): Promise<object> {
    try {
      return await this.genericObjectPersistenceDriver.delete(objectId);
    } catch (e) {
      throw new CustomError({
        code: CustomErrorCodes.ERROR_IN_OBJECT_DELETE,
        message: `Error deleting object with id ${objectId}.`,
        payload: {
          collectionName: this.genericObjectPersistenceDriver.collectionName,
          error: e,
          objectId,
        },
        reportAsError: true,
        status: 'unknown',
      });
    }
  }

  public async afterDelete(deletedObject: T): Promise<Record<string, object>> {
    const deleteObjectResult: Record<string, object> = {};

    if (this.genericObjectSearchEngineGateway) {
      try {
        deleteObjectResult['searchEngineDeletionResult'] =
          await this.genericObjectSearchEngineGateway.delete(deletedObject.id);
      } catch (e) {
        deleteObjectResult['searchEngineDeletionResult'] = e as object;
      }
    }

    return deleteObjectResult;
  }
}
