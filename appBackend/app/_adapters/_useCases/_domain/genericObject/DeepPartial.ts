export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export const newArray = <T extends DeepPartial<R>, R>(
  object?: Array<T | undefined>,
  mapper?: (value: T) => R
): R[] =>
  object
    ?.filter((value): value is T => value !== undefined)
    .map((value) => (mapper ? mapper(value) : (value as unknown as R))) ?? [];

export const newObject = <T extends DeepPartial<R>, R>(
  object?: { [key: string]: T | undefined },
  mapper?: (value: T) => R
): { [key: string]: R } =>
  Object.entries(object ?? {}).reduce((acc: Record<string, R>, [key, value]) => {
    if (value !== undefined) {
      acc[key] = mapper
        ? mapper(value)
        : (acc[key] = typeof value === 'object' ? (newObject(value) as unknown as R) : value);
    }
    return acc;
  }, {});
