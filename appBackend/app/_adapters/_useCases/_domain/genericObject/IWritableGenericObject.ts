import { DeepPartial } from './DeepPartial';
import {
  checkWritablePublicGenericObject,
  IWritablePublicGenericObject,
  newFakeWritablePublicGenericObject,
  newWritablePublicGenericObject,
} from './IWritablePublicGenericObject';

type ThisInterface = IWritableGenericObject;

export const checkWritableGenericObjectRequest = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): ThisInterface => ({
  ...checkWritablePublicGenericObject(request, contextPath),
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
