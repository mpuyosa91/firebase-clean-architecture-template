import { DeepPartial } from './DeepPartial';
import {
  checkWritablePublicGenericObjectRequest,
  IWritablePublicGenericObject,
  newFakeWritablePublicGenericObject,
  newWritablePublicGenericObject,
} from './IWritablePublicGenericObject';

type ThisInterface = IWritableGenericObject;

export const checkWritableGenericObjectRequest = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): ThisInterface => ({
  ...checkWritablePublicGenericObjectRequest(request, contextPath),
});

export const newWritableGenericObject = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newWritablePublicGenericObject(object),
  };

  return toReturnObject;
};

export type IWritableGenericObject = IWritablePublicGenericObject;

export const newFakeWritableGenericObject = (): ThisInterface => {
  return newWritableGenericObject({
    ...newFakeWritablePublicGenericObject(),
  });
};
