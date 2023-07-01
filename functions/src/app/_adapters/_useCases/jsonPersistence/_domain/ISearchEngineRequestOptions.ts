export enum SearchEngineRequestOptionsSourceEnum {
  SEARCH_ENGINE = 'SEARCH_ENGINE',
  NO_SQL_DB = 'NO_SQL_DB',
}

export interface ISearchEngineRequestOptions {
  /**
   * @default ""
   */
  query: string;

  /**
   * @default false
   */
  renewCache: boolean;

  /**
   * @default 0
   */
  currentPage: number;

  /**
   * @default 10
   */
  resultsPerPage: number;

  /**
   * @default ""
   */
  filters: string;

  /**
   * @default[]
   */
  facetFilters: string[];

  facetsToRetrieve?: string[];

  /**
   * @default SEARCH_ENGINE
   */
  source: SearchEngineRequestOptionsSourceEnum;
}
