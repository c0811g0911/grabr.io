import {Actions} from './Constants';
import {AdminItemListStore} from '../stores/AdminSequenceStores';
import {ItemStore} from '../stores/DataStores';
import URI from 'urijs';
import {makeAuthorizedRequest, makePaginatedRequest} from '../utils/ActionUtils';

export const ADMIN_ITEM_ENDPOINT = {
  amplify: `/admin/items{/id}/amplify`,
  read: '/admin/items{/id}',
  readFromUrl: '/items/url',
  readList: '/admin/items'
};

export async function amplifyAdminItem(context, payload) {
  const {dispatch} = context;
  const {id} = payload;
  const endpoint = URI.expand(ADMIN_ITEM_ENDPOINT.amplify, {id}).href();
  const options = {version: 2};
  await makeAuthorizedRequest('post', endpoint, options, context);
  return dispatch(Actions.AMPLIFY_SEQUENCE_ITEM, {
    id, sequenceName: AdminItemListStore.sequenceName
  });
}

export async function readAdminItem(context, payload) {
  const {dispatch} = context;
  const {id} = payload;
  const endpoint = URI.expand(ADMIN_ITEM_ENDPOINT.read, {id}).href();
  const options = {version: 2};
  const {body: json} = await makeAuthorizedRequest('get', endpoint, options, context);
  dispatch(Actions.LOAD_DATA_SUCCESS, {json});
  return dispatch(Actions.LOAD_DATA_ITEM, {id, storeName: ItemStore.storeName});
}

export async function readAdminItemFromUrl(context, payload) {
  const {dispatch} = context;
  const {url} = payload;
  const endpoint = ADMIN_ITEM_ENDPOINT.readFromUrl;
  const query = {url};
  const options = {query, version: 2};
  const {body: json} = await makeAuthorizedRequest('post', endpoint, options, context);
  if (!json.errors && !!json.item.title) {
    json.item.id = url;
    dispatch(Actions.LOAD_DATA_SUCCESS, {json});
    logger.debug('loaded data', json)
    dispatch(Actions.LOAD_DATA_ITEM, {id: url, storeName: ItemStore.storeName});
  }
}

export async function readAdminItemList(context, payload) {
  const {append, filters = {published: true}, pageNumber, pageSize} = payload;
  const endpoint = '/admin/items';
  const options = {
    append,
    pageNumber,
    pageSize,
    query: {filter: filters},
    sequenceName: AdminItemListStore.sequenceName,
    version: 2
  };
  return await makePaginatedRequest(context, endpoint, options);
}



// WEBPACK FOOTER //
// ./src/main/app/actions/AdminItemActionCreators.js