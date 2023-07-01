import short from 'short-uuid';
import { DeepPartial } from './DeepPartial';
import { IWithId, newFakeWithId, newWithId } from './IWithId';

const shortUuidTranslator = short('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');

type ThisInterface = IIdentifiableUuid;
export const newIdentifiableUuid = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newWithId(object),
    dId: object?.dId ?? '',
  };

  toReturnObject.dId = shortUuidTranslator.fromUUID(toReturnObject.id).substr(0, 8);

  return toReturnObject;
};

export interface IIdentifiableUuid extends IWithId {
  /**
   * Shorted ID
   *
   * @default ""
   */
  dId: string;
}

export const newFakeIdentifiableUuid = (): ThisInterface => {
  return newIdentifiableUuid({
    ...newFakeWithId(),
  });
};
