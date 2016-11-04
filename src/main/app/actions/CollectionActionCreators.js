import {Actions} from '../actions/Constants';
import {
  CollectionItemsStore,
  CollectionsPageStore,
  CollectionTagsStore,
  ShopPageCuratedCollectionsStore,
  ShopPageFeaturedCollectionsStore,
  ShopPagePartnerCollectionsStore
} from '../stores/SequenceStores';
import {CollectionStore} from '../stores/DataStores';
import {makeAuthorizedRequest, makePaginatedRequest} from '../utils/ActionUtils';

export function readShopPageCuratedCollections(context, {count}) {
  return makePaginatedRequest(context, '/collections', {
    pageSize: count,
    pageNumber: 0,
    version: 2,
    query: {filter: {partnership: 'person'}},
    sequenceName: ShopPageCuratedCollectionsStore.sequenceName
  });
}

export function readShopPageFeaturedCollections(context, {count}) {
  return makePaginatedRequest(context, '/collections', {
    pageSize: count,
    pageNumber: 0,
    version: 2,
    query: {filter: {partnership: 'none'}},
    sequenceName: ShopPageFeaturedCollectionsStore.sequenceName
  });
}

export function readShopPagePartnerCollections(context, {count}) {
  return makePaginatedRequest(context, '/collections', {
    pageSize: count,
    pageNumber: 0,
    version: 2,
    query: {filter: {partnership: 'organization'}},
    sequenceName: ShopPagePartnerCollectionsStore.sequenceName
  });
}

export function loadCollectionsPage(context, {pageSize, pageNumber, append, filters}) {
  return makePaginatedRequest(context, '/collections', {
    pageSize,
    pageNumber,
    append,
    version: 2,
    query: {filter: filters},
    sequenceName: CollectionsPageStore.sequenceName
  });
}

export function loadCollectionItems(context, {filters: {id, tagIds}, pageNumber, pageSize, append}, done) {
  const query = tagIds ? {filter: {tag_ids: tagIds}} : {};

  return makePaginatedRequest(context, `/collections/${ id }/items`, {
    pageNumber, pageSize, append, done, version: 2, query,
    sequenceName: CollectionItemsStore.sequenceName
  });
}

export async function loadCollection(context, {id}) {
  const {body: json} = await makeAuthorizedRequest('get', `/collections/${ id }`, {version: 2}, context);
  context.dispatch(Actions.LOAD_DATA_SUCCESS, {json});
  return context.dispatch(Actions.LOAD_DATA_ITEM, {id, storeName: CollectionStore.storeName});
}

export async function loadCollectionTags(context, {id, tagIds}) {
  const {body: json} = await makeAuthorizedRequest('get', `/collections/${ id }/tags`, {
    version: 2,
    query: {tag_ids: tagIds}
  }, context);
  return context.dispatch(Actions.LOAD_SEQUENCE_SUCCESS, {
    json, sequenceName: CollectionTagsStore.sequenceName
  });
}



// WEBPACK FOOTER //
// ./src/main/app/actions/CollectionActionCreators.js