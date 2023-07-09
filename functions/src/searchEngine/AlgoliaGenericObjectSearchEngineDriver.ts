import {
  CollectionNames,
  IGenericObjectSearchEngineDriver,
  ISearchEngineGenericObject,
  ISearchEngineRequestOptions,
  ISearchEngineResult,
  maxSearchEngineResultsPerPage,
  newPublicUser,
  newUser,
} from 'appbackend';
import algoliaSearchKeys from './algoliaSearchKeys.json';
import { Settings } from '@algolia/client-search';
import algoliaSearch, { SearchClient, SearchIndex } from 'algoliasearch';
import * as functions from 'firebase-functions';

export class AlgoliaGenericObjectSearchEngineDriver<T extends ISearchEngineGenericObject>
  implements IGenericObjectSearchEngineDriver<T>
{
  private alreadySentSettings = false;
  private client: SearchClient = algoliaSearch(
    algoliaSearchKeys.app_id,
    algoliaSearchKeys.admin_api_key
  );
  private index: SearchIndex;

  constructor(readonly indexName: CollectionNames) {
    this.index = this.client.initIndex(indexName as string);
  }

  public async write<U extends T>(object: U): Promise<U> {
    this.trySetSettings();

    await this.index.saveObject(object);

    return object;
  }

  public async read(objectId: string): Promise<T | null> {
    return this.index.getObject(objectId);
  }

  public async search(
    searchEngineRequestOptions: ISearchEngineRequestOptions
  ): Promise<ISearchEngineResult<T>> {
    if (searchEngineRequestOptions.renewCache) {
      await this.client.clearCache();
    }

    const searchResult = await this.index.search<T>(searchEngineRequestOptions.query, {
      attributesToHighlight: [],
      attributesToRetrieve: ['*'],
      facets: searchEngineRequestOptions.facetsToRetrieve ?? ['*'],
      facetFilters: searchEngineRequestOptions.facetFilters,
      filters: searchEngineRequestOptions.filters,
      hitsPerPage: searchEngineRequestOptions.resultsPerPage,
      page: searchEngineRequestOptions.currentPage,
    });

    return {
      currentPage: searchResult.page,
      facets: searchResult.facets,
      results: searchResult.hits,
      totalResults: searchResult.nbHits,
    };
  }

  public async delete(objectId: string): Promise<object> {
    this.trySetSettings();

    return this.index.deleteObject(objectId);
  }

  private trySetSettings() {
    if (this.alreadySentSettings) {
      return;
    }
    this.alreadySentSettings = true;

    const generalIndexSettings: Settings = {
      advancedSyntax: true,
      alternativesAsExact: ['ignorePlurals', 'singleWordSynonym'],
      attributesToSnippet: [],
      exactOnSingleWordQuery: 'word',
      highlightPostTag: '</em>',
      highlightPreTag: '<em>',
      // responseFields: ['*'],
      hitsPerPage: 20,
      maxFacetHits: 10,
      maxValuesPerFacet: 100,
      minProximity: 1,
      minWordSizefor1Typo: 4,
      minWordSizefor2Typos: 8,
      paginationLimitedTo: maxSearchEngineResultsPerPage,
      queryType: 'prefixLast',
      ranking: ['geo', 'attribute', 'filters', 'words', 'proximity', 'typo', 'exact', 'custom'],
      removeWordsIfNoResults: 'allOptional',
      separatorsToIndex: '',
      snippetEllipsisText: '...',
      sortFacetValuesBy: 'count',
    };

    let specificIndexSettings: Settings = {};
    switch (this.indexName) {
      case CollectionNames.USERS:
        specificIndexSettings = {
          attributesForFaceting: [
            'enabled',
            'filterOnly(createdAtTimestamp)',
            'filterOnly(id)',
            'filterOnly(updatedAtTimestamp)',
            'isVisible',
            'mainLanguage',
            'objectType',
          ],
          customRanking: ['desc(updatedAtTimestamp)'],
          disableExactOnAttributes: [],
          ranking: ['desc(createdAtTimestamp)', ...(generalIndexSettings.ranking ?? [])],
          searchableAttributes: ['id', 'email', 'firstName', 'lastName'],
          unretrievableAttributes: Object.keys(newUser()).filter(
            (attr) => !Object.keys(newPublicUser()).includes(attr)
          ),
        };
        break;
      default:
    }

    this.index
      .setSettings({
        ...generalIndexSettings,
        ...specificIndexSettings,
      })
      .catch((err) => functions.logger.error(err));
  }
}
