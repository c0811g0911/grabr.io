import {Actions} from '../actions/Constants';
import {
  AdminCollectionSuggestionListStore,
  AdminGrabListStore,
  AdminTagSuggestionListStore,
  AdminUserListStore,
  AdminUserSuggestionListStore
} from '../stores/AdminSequenceStores';
import {makeAuthorizedRequest, makePaginatedRequest} from '../utils/ActionUtils';
import URI from 'urijs';

export function readAdminUserList(context, {pageNumber, pageSize, append, filters}) {
  return makePaginatedRequest(context, '/admin/users', {
    pageNumber, pageSize, append,
    sequenceName: AdminUserListStore.sequenceName,
    query: {
      sort: '-created',
      filter: filters && filters.onlyTravelers ? {travelers: 'true'} : {}
    }
  });
}

export async function grantAdmin(context, payload) {
  const {executeAction} = context;
  const {id} = payload;
  const endpoint = URI.expand('/admin/users{/id}/admin', {id}).href();
  const options = {version: 2};
  await makeAuthorizedRequest('post', endpoint, options, context);
  return executeAction(readAdminUserList);
}

export async function revokeAdmin(context, payload) {
  const {executeAction} = context;
  const {id} = payload;
  const endpoint = URI.expand('/admin/users{/id}/admin', {id}).href();
  const options = {version: 2};
  await makeAuthorizedRequest('del', endpoint, options, context);
  return executeAction(readAdminUserList);
}

export async function blockUser(context, payload) {
  const {executeAction} = context;
  const {id} = payload;
  const endpoint = URI.expand('/admin/users{/id}/block', {id}).href();
  const options = {version: 2};
  await makeAuthorizedRequest('post', endpoint, options, context);
  return executeAction(readAdminUserList);
}

export async function unblockUser(context, payload) {
  const {executeAction} = context;
  const {id} = payload;
  const endpoint = URI.expand('/admin/users{/id}/block', {id}).href();
  const options = {version: 2};
  await makeAuthorizedRequest('del', endpoint, options, context);
  return executeAction(readAdminUserList);
}

export async function readAdminGrabList(context, {pageNumber, pageSize, append, filters}) {
  return makePaginatedRequest(context, '/admin/grabs', {
    pageNumber, pageSize, append, version: 2,
    sequenceName: AdminGrabListStore.sequenceName,
    query: {
      sort: '-created',
      filter: filters
    }
  });
}

export function readAdminUserSuggestionList(context, payload) {
  const {query} = payload;
  const endpoint = '/admin/users';
  const options = {
    query: {
      filter: {query}
    },
    sequenceName: AdminUserSuggestionListStore.sequenceName,
    version: 2
  };
  return makePaginatedRequest(context, endpoint, options);
}

export function clearAdminUserSuggestionList(context, {}) {
  return context.dispatch(Actions.CLEAR_SEQUENCES, {sequenceNames: [AdminUserSuggestionListStore.sequenceName]});
}

export function readAdminCollectionSuggestionList(ctx) {
  return makeAuthorizedRequest('get', '/admin/collections', {version: 2}, ctx).then(res => {
    ctx.dispatch(Actions.LOAD_SEQUENCE_SUCCESS, {
      json: res.body,
      sequenceName: AdminCollectionSuggestionListStore.sequenceName
    });
  });
}

export function readAdminTagSuggestionList(ctx) {
  return makeAuthorizedRequest('get', '/admin/tags', {version: 2}, ctx).then(res => {
    ctx.dispatch(Actions.LOAD_SEQUENCE_SUCCESS, {
      json: res.body,
      sequenceName: AdminTagSuggestionListStore.sequenceName
    });
  });
}



// WEBPACK FOOTER //
// ./src/main/app/actions/AdminActionCreators.js