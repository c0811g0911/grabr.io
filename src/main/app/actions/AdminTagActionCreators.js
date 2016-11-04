import {Actions} from './Constants';
import {AdminTagListStore} from '../stores/AdminSequenceStores';
import {makeAuthorizedRequest, makePaginatedRequest} from '../utils/ActionUtils';
import {TagStore} from '../stores/DataStores';
import URI from 'urijs';

export const ADMIN_TAG_ENDPOINT = {
  amplify: '/admin/tags{/id}/amplify',
  create: '/admin/tags',
  delete: '/admin/tags{/id}',
  readList: '/admin/tags',
  update: '/admin/tags{/id}'
};

export async function amplifyAdminTag(context, payload) {
  const {dispatch} = context;
  const {id} = payload;
  const endpoint = URI.expand(ADMIN_TAG_ENDPOINT.amplify, {id}).href();
  const options = {version: 2};
  await makeAuthorizedRequest('post', endpoint, options, context);
  return dispatch(Actions.AMPLIFY_SEQUENCE_ITEM, {id, sequenceName: AdminTagListStore.sequenceName});
}

export async function createAdminTag(context, payload) {
  const {dispatch} = context;
  const {en, id, image_file_id, ru} = payload;
  const rIO = {id, type: TagStore.type};
  try {
    const endpoint = URI.expand(ADMIN_TAG_ENDPOINT.create, {}).href();
    const query = {tag: {title: {en, ru}, image_file_id}};
    const options = {query, version: 2};
    dispatch(Actions.CREATE_START, rIO);
    const {body: json} = await makeAuthorizedRequest('post', endpoint, options, context);
    return dispatch(Actions.CREATE_SUCCESS, {...rIO, json});
  } catch (error) {
    return dispatch(Actions.CREATE_FAILURE, rIO);
  }
}

export async function deleteAdminTag(context, payload) {
  const {dispatch} = context;
  const {id} = payload;
  const rIO = {id, type: TagStore.type};

  try {
    const endpoint = URI.expand(ADMIN_TAG_ENDPOINT.delete, {id}).href();
    const options = {version: 2};
    dispatch(Actions.DELETE_START, rIO);
    await makeAuthorizedRequest('del', endpoint, options, context);
    return dispatch(Actions.DELETE_SUCCESS, rIO);
  } catch (error) {
    return dispatch(Actions.DELETE_FAILURE, rIO);
  }
}

export async function readAdminTagList(context, payload) {
  const {append, pageNumber, pageSize} = payload;
  const endpoint = URI.expand(ADMIN_TAG_ENDPOINT.readList, {}).href();
  const options = {
    append,
    pageNumber,
    pageSize,
    sequenceName: AdminTagListStore.sequenceName,
    version: 2
  };
  return await makePaginatedRequest(context, endpoint, options);
}

export async function updateAdminTag(context, payload) {
  const {dispatch} = context;
  const {id, en, ru, image_file_id} = payload;
  const rIO = {id, type: TagStore.type};
  try {
    const endpoint = URI.expand(ADMIN_TAG_ENDPOINT.update, {id}).href();
    const query = {tag: {title: {en, ru}, image_file_id}};
    const options = {query, version: 2};
    dispatch(Actions.UPDATE_START, rIO);
    const {body: json} = await makeAuthorizedRequest('patch', endpoint, options, context);
    return dispatch(Actions.UPDATE_SUCCESS, {...rIO, json});
  } catch (error) {
    return dispatch(Actions.UPDATE_FAILURE, rIO);
  }
}



// WEBPACK FOOTER //
// ./src/main/app/actions/AdminTagActionCreators.js