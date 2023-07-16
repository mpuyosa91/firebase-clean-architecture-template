import { v4 as uuidV4 } from 'uuid';
import { DeepPartial } from './DeepPartial';
import { Validator } from '../validator';

type ThisInterface = IWithId;

export const checkNonStrictWithId = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): DeepPartial<ThisInterface> => {
  if (request.id) {
    request.id = Validator.validateRegex(
      { value: request.id, name: 'id', contextPath },
      /(\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b)/
    );
  }

  return request;
};

export const checkWithId = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): ThisInterface => {
  request.id = request.id ?? uuidV4();

  request.id = Validator.validateExistence({ value: request.id, name: 'id', contextPath });

  request.id = Validator.validateRegex(
    { value: request.id, name: 'id', contextPath },
    /(\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b)/
  );

  return newWithId(checkNonStrictWithId(request, contextPath));
};

export const newWithId = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    id: object?.id ?? uuidV4(),
  };

  return toReturnObject;
};

export interface IWithId {
  /**
   * Full UUID
   *
   * @pattern (\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b)
   */
  id: string;
}

export const newFakeWithId = (): ThisInterface => {
  return newWithId({
    id: uuidV4(),
  });
};
