import { IJsonHelperServiceGateway } from '../_useCases';
import _ from 'lodash';

export class JsonHelperServiceGatewayAdapter implements IJsonHelperServiceGateway {
  constructor(private test: boolean = false) {}

  public deepMerge<T, U>(object: T, source: U): T & U {
    return _.merge(object, source);
  }

  public deepClone<T>(value: T): T {
    return _.cloneDeep(value);
  }

  public uniqueArray<T>(array: T[]): T[] {
    return _.uniq(array);
  }

  public uniqueArrayBy<T>(array: T[], property: string): T[] {
    return _.uniqBy(array, property);
  }

  public async delay(ms: number): Promise<void> {
    if (this.test) {
      return Promise.resolve();
    }
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public compareEqual(value: object, other: object): boolean {
    if ((!value || !other) && typeof value !== typeof other) {
      return false;
    }

    const isolatedValue = this.deepClone(value);
    const isolatedOther = this.deepClone(other);

    if (isolatedValue && 'updatedAt' in isolatedValue) {
      delete isolatedValue.updatedAt;
    }

    if (isolatedOther && 'updatedAt' in isolatedOther) {
      delete isolatedOther.updatedAt;
    }

    if (isolatedValue && 'updatedAtBySystem' in isolatedValue) {
      delete isolatedValue.updatedAtBySystem;
    }

    if (isolatedOther && 'updatedAtBySystem' in isolatedOther) {
      delete isolatedOther.updatedAtBySystem;
    }

    return _.isEqual(isolatedValue, isolatedOther);
  }

  public async executePromiseInGroups<T>(
    array: Array<() => Promise<T>>,
    payload: { ms?: number; n?: number; eachGroupCallback?: (partial: T[]) => void } = {}
  ): Promise<T[]> {
    payload.n = payload.n ?? Number.MAX_SAFE_INTEGER;
    payload.ms = payload.ms ?? 0;

    const result: T[] = [];

    const groupCallbacks = this.groupArray(payload.n, array);
    for (const groupCallback of groupCallbacks) {
      const groupResult = await Promise.all(groupCallback.map(async (f) => f()));
      groupResult.forEach((r) => result.push(r));
      if (payload.eachGroupCallback) {
        payload.eachGroupCallback(result);
      }
      if (payload.ms > 0) {
        await this.delay(payload.ms);
      }
    }

    return result;
  }

  public groupArray<T>(n: number, array: T[]): T[][] {
    return array.reduce(
      (groups: T[][], promise) => {
        const currentLength = groups.length - 1;
        if (groups[currentLength].length < n) {
          groups[currentLength].push(promise);
        } else {
          groups.push([promise]);
        }
        return groups;
      },
      [[]]
    );
  }

  public mergeArray<T>(groupArray: T[][]): T[] {
    let toReturnArray: T[] = [];
    groupArray.forEach((array) => (toReturnArray = toReturnArray.concat(array)));

    return toReturnArray;
  }

  public serialize<T>(value: T): object {
    return !value ? (value as object) : this.deepClone(value);
  }

  public toTitleCase(str: string): string {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
}
