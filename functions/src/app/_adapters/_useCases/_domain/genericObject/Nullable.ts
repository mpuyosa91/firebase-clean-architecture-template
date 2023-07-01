import { DeepPartial } from './DeepPartial';

export type Nullable<T> = T | null;

type NullableMapper<T extends DeepPartial<R>, R> = (value: T) => R;

export const newNullable = <T extends DeepPartial<R>, R>(
  mapper: R | NullableMapper<T, R>,
  element?: Nullable<T>
): Nullable<R> => {
  return element
    ? typeof mapper === 'function'
      ? (mapper as NullableMapper<T, R>)(element)
      : mapper
    : null;
};
