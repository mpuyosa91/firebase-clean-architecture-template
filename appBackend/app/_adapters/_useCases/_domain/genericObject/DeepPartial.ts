export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export const newArray = <T extends DeepPartial<R>, R>(
  object?: Array<T | undefined>,
  mapper?: (value: T) => R
): R[] =>
  object
    ?.filter((value): value is T => value !== undefined)
    .map((value) => {
      if (mapper) {
        return mapper(value);
      }

      return value as unknown as R;
    }) ?? [];

export const newObject = <T extends DeepPartial<R>, R>(
  object?: { [key: string]: T | undefined },
  mapper?: (value: T) => R
): { [key: string]: R } =>
  Object.entries(object ?? {}).reduce((acc: Record<string, R>, [key, value]) => {
    if (value !== undefined) {
      if (mapper) {
        acc[key] = mapper(value);
      } else if (typeof value === 'object') {
        acc[key] = newObject(value) as unknown as R;
      } else {
        acc[key] = value;
      }
    }
    return acc;
  }, {});
