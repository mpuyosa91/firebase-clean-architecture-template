export function sortObject<T extends object | string>(unorderedObject: T): T {
  if (
    typeof unorderedObject !== 'object' ||
    !unorderedObject ||
    (unorderedObject as { error: unknown }).error
  ) {
    return unorderedObject;
  }

  if (Array.isArray(unorderedObject)) {
    return unorderedObject.map((objectElement) => sortObject(objectElement)).sort() as T;
  }

  const unorderedObjectEntries = Object.entries(unorderedObject);

  const orderedObject: { [index: string]: T } = {};
  Object.keys(unorderedObject)
    .sort()
    .forEach((key) => {
      const picketValue = unorderedObjectEntries.find(([k, _]) => k === key)?.[1];

      orderedObject[key] = sortObject(picketValue);
    });
  Object.assign(unorderedObject, orderedObject);

  return orderedObject as T;
}
