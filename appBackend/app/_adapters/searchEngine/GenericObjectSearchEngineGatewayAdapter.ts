import {
  CustomError,
  CustomErrorCodes,
  ISearchEngineGenericObject,
  ISearchEngineRequestOptions,
  ISearchEngineResult,
  IGenericObjectSearchEngineGateway,
} from '../_useCases';
import { IGenericObjectSearchEngineDriver } from './IGenericObjectSearchEngineDriver';
import { cloneDeep } from 'lodash';

export class GenericObjectSearchEngineGatewayAdapter<T extends ISearchEngineGenericObject>
  implements IGenericObjectSearchEngineGateway<T>
{
  constructor(private genericObjectSearchEngineDriver: IGenericObjectSearchEngineDriver<T>) {}

  public async write<U extends T>(object: U): Promise<U> {
    const objectId = object.id;
    const objectType = object.objectType;

    try {
      return cloneDeep(await this.genericObjectSearchEngineDriver.write(object));
    } catch (e) {
      throw new CustomError({
        code: CustomErrorCodes.ERROR_IN_SEARCH_ENGINE_OBJECT_WRITE,
        message: `Error writing object with id ${objectId} and type ${objectType}.`,
        payload: {
          indexName: this.genericObjectSearchEngineDriver.indexName,
          error: e,
          object,
        },
        reportAsError: true,
        status: 'unknown',
      });
    }
  }

  public async read(objectId: string): Promise<T | null> {
    try {
      return cloneDeep(await this.genericObjectSearchEngineDriver.read(objectId));
    } catch (e) {
      throw new CustomError({
        code: CustomErrorCodes.ERROR_IN_SEARCH_ENGINE_OBJECT_READ,
        message: `Error reading object with id ${objectId}.`,
        payload: {
          indexName: this.genericObjectSearchEngineDriver.indexName,
          error: e,
          objectId,
        },
        reportAsError: true,
        status: 'unknown',
      });
    }
  }

  public async search(
    searchEngineRequestOptions: ISearchEngineRequestOptions
  ): Promise<ISearchEngineResult<T>> {
    try {
      return cloneDeep(
        await this.genericObjectSearchEngineDriver.search(searchEngineRequestOptions)
      );
    } catch (e) {
      throw new CustomError({
        code: CustomErrorCodes.ERROR_IN_SEARCH_ENGINE_OBJECT_SEARCH,
        message: `Error searching objects.`,
        payload: {
          indexName: this.genericObjectSearchEngineDriver.indexName,
          error: e,
          searchEngineRequestOptions,
        },
        reportAsError: true,
        status: 'unknown',
      });
    }
  }

  public async delete(objectId: string): Promise<object> {
    try {
      return cloneDeep(await this.genericObjectSearchEngineDriver.delete(objectId));
    } catch (e) {
      throw new CustomError({
        code: CustomErrorCodes.ERROR_IN_SEARCH_ENGINE_OBJECT_DELETE,
        message: `Error deleting object with id ${objectId}.`,
        payload: {
          indexName: this.genericObjectSearchEngineDriver.indexName,
          error: e,
          objectId,
        },
        reportAsError: true,
        status: 'unknown',
      });
    }
  }
}
