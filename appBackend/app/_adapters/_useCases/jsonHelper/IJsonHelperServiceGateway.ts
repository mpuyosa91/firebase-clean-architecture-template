export interface IJsonHelperServiceGateway {
  deepMerge<T, U>(object: T, source: U): T & U;

  deepClone<T>(value: T): T;

  serialize<T>(value: T): object;

  compareEqual(value: object, other: object): boolean;

  uniqueArray<T>(array: T[]): T[];

  uniqueArrayBy<T>(array: T[], property: string): T[];

  mergeArray<T>(groupArray: T[][]): T[];

  groupArray<T>(n: number, array: T[]): T[][];

  delay(ms: number): Promise<void>;

  executePromiseInGroups<T>(
    array: Array<() => Promise<T>>,
    payload?: {
      ms?: number;
      n?: number;
      eachGroupCallback?: (partial: T[]) => void;
    }
  ): Promise<T[]>;

  toTitleCase(str: string): string;
}
