import {Actions} from './Constants';
import {AdminCollectionListStore} from '../stores/AdminSequenceStores';
import {CollectionStore} from '../stores/DataStores';
import URI from 'urijs';
import {makeAuthorizedRequest, makePaginatedRequest} from '../utils/ActionUtils';

export const ADMIN_COLLECTION_ENDPOINT = {
  create: '/admin/collections',
  delete: '/admin/collections{/id}',
  read: '/admin/collections{/id}',
  readList: '/admin/collections',
  update: '/admin/collections{/id}',
  updatePositions: '/admin/collections/positions'
};

export async function readAdminCollection(context, payload) {
  const {dispatch} = context;
  const {id} = payload;
  const endpoint = URI.expand(ADMIN_COLLECTION_ENDPOINT.read, {id}).href();
  const options = {};
  const {body: json} = await makeAuthorizedRequest('get', endpoint, options, context);
  dispatch(Actions.LOAD_DATA_SUCCESS, {json});
  return dispatch(Actions.LOAD_DATA_ITEM, {id, storeName: CollectionStore.storeName});
}

export async function readAdminCollectionList(context, {pageNumber, pageSize, append}) {
  const endpoint = URI.expand(ADMIN_COLLECTION_ENDPOINT.readList, {}).href();
  const options = {
    pageNumber, pageSize, append,
    sequenceName: AdminCollectionListStore.sequenceName
  };
  return makePaginatedRequest(context, endpoint, options);
}

export async function createAdminCollection(context, {description, id, images, title, lead, targetLocation}) {
  const {dispatch} = context;
  const payload = {id, type: CollectionStore.type};
  const endpoint = URI.expand(ADMIN_COLLECTION_ENDPOINT.create, {}).href();
  const imageFileIds = images.map(({fileId}) => fileId);
  const options = {
    query: {
      collection: {
        description,
        title,
        lead,
        image_file_ids: imageFileIds,
        target_location_id: (targetLocation || {}).id || null
      }
    },
    version: 2
  };

  try {
    dispatch(Actions.CREATE_START, payload);
    const {body: json} = await makeAuthorizedRequest('post', endpoint, options, context);
    return dispatch(Actions.CREATE_SUCCESS, {...payload, json});
  } catch (error) {
    return dispatch(Actions.CREATE_FAILURE, payload);
  }
}

export async function updateAdminCollection(context, {description, id, images, title, lead, targetLocation}) {
  const {dispatch} = context;
  const payload = {id, type: CollectionStore.type};
  const endpoint = URI.expand(ADMIN_COLLECTION_ENDPOINT.update, {id}).href();
  const imageFileIds = images.map(({fileId}) => fileId);
  const options = {
    query: {
      collection: {
        description,
        title,
        lead,
        image_file_ids: imageFileIds,
        target_location_id: (targetLocation || {}).id || null
      }
    },
    version: 2
  };

  try {
    dispatch(Actions.UPDATE_START, payload);
    const {body: json} = await makeAuthorizedRequest('patch', endpoint, options, context);
    return dispatch(Actions.UPDATE_SUCCESS, {...payload, json});
  } catch (error) {
    return dispatch(Actions.UPDATE_FAILURE, payload);
  }
}

export async function deleteAdminCollection(context, {id}) {
  const {dispatch} = context;
  const payload = {id, type: CollectionStore.type};
  const endpoint = URI.expand(ADMIN_COLLECTION_ENDPOINT.delete, {id}).href();
  const options = {version: 2};

  try {
    dispatch(Actions.DELETE_START, payload);
    await makeAuthorizedRequest('del', endpoint, options, context);
    return dispatch(Actions.DELETE_SUCCESS, payload);
  } catch (error) {
    return dispatch(Actions.DELETE_FAILURE, payload);
  }
}

export async function updateAdminCollectionListPositions(context, {ids}) {
  const endpoint = ADMIN_COLLECTION_ENDPOINT.updatePositions;
  const options = {
    query: {ids},
    version: 2
  };
  return await makeAuthorizedRequest('post', endpoint, options, context);
}



// WEBPACK FOOTER //
// ./src/main/app/actions/AdminCollectionActionCreators.js