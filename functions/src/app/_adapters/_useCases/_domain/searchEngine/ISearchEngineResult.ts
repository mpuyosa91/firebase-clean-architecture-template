export interface ISearchEngineResult<T> {
  /**
   * @default []
   */
  results: T[];

  /**
   * @default undefined
   */
  facets?: Record<string, Record<string, number>>;

  /**
   * @default 0
   */
  currentPage: number;

  /**
   * default 0
   */
  totalResults: number;
}
