import { v4 as uuidV4 } from 'uuid';
import { DeepPartial } from './DeepPartial';

type ThisInterface = IIdentifiableUuid;
export const newIdentifiableUuid = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    dId: object?.dId ?? '',
    id: object?.id ?? uuidV4(),
  };

  toReturnObject.dId = toReturnObject.id.slice(0, 8);

  return toReturnObject;
};

export interface IIdentifiableUuid {
  /**
   * Full UUID
   *
   * @pattern (\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b)|(NG_.*)|(TP_.*)|(\d{4})-(\d{2})-(\d{2})|([A-Z]{2,3})|(_.*)
   */
  id: string;

  /**
   * Shorted ID
   *
   * @default ""
   */
  dId: string;
}

export const newFakeIdentifiableUuid = (): ThisInterface => {
  return newIdentifiableUuid({
    id: uuidV4(),
  });
};
