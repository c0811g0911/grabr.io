import {Actions} from './Constants';
import {handleError} from '../utils/handleError';
import {AdminPromotionListActiveStore, AdminPromotionListExpiredStore} from '../stores/AdminSequenceStores';
import {makeAuthorizedRequest, makePaginatedRequest} from '../utils/ActionUtils';
import {PromotionStore} from '../stores/DataStores';
import URI from 'urijs';
import {pushHistoryState} from './HistoryActionCreators';

export const ADMIN_PROMOTION_ENDPOINT = {
  create: '/admin/promotions',
  delete: '/admin/promotions{/id}',
  read: '/admin/promotions{/id}',
  readList: '/admin/promotions{?filter*}',
  update: '/admin/promotions{/id}'
};

export async function createAdminPromotion(context, payload) {
  const {dispatch, executeAction} = context;
  const {id, promotion} = payload;
  const rIO = {id, type: PromotionStore.type};
  try {
    const endpoint = ADMIN_PROMOTION_ENDPOINT.create;
    const query = {promotion};
    const options = {query, version: 2};
    dispatch(Actions.CREATE_START, rIO);
    const {body: json} = await makeAuthorizedRequest('post', endpoint, options, context);
    dispatch(Actions.CREATE_SUCCESS, {...rIO, json});
    return await executeAction(pushHistoryState, ['/admin/promotions']);
  } catch (error) {
    handleError(error, context, {action: Actions.CREATE_FAILURE, actionOptions: rIO});
  }
}

export async function deleteAdminPromotion(context, payload) {
  const {dispatch} = context;
  const {id} = payload;
  const rIO = {id, type: PromotionStore.type};
  try {
    const endpoint = URI.expand(ADMIN_PROMOTION_ENDPOINT.delete, {id}).href();
    const options = {version: 2};
    dispatch(Actions.DELETE_START, rIO);
    await makeAuthorizedRequest('del', endpoint, options, context);
    return dispatch(Actions.DELETE_SUCCESS, rIO);
  } catch (error) {
    return dispatch(Actions.DELETE_FAILURE, rIO);
  }
}

export async function readAdminPromotion(context, payload) {
  const {dispatch} = context;
  const {id} = payload;
  const endpoint = URI.expand(ADMIN_PROMOTION_ENDPOINT.read, {id}).href();
  const options = {};
  const {body: json} = await makeAuthorizedRequest('get', endpoint, options, context);
  dispatch(Actions.LOAD_DATA_SUCCESS, {json});
  return dispatch(Actions.LOAD_DATA_ITEM, {id, storeName: PromotionStore.storeName});
}

export async function readAdminPromotionListActive(context, payload = {}) {
  const {dispatch} = context;
  const sequenceName = AdminPromotionListActiveStore.sequenceName;
  try {
    const endpoint = URI.expand(ADMIN_PROMOTION_ENDPOINT.readList, {
      filter: {'filter[expired]': false}
    }).href();
    const options = {...payload, version: 2, sequenceName};
    const {body: json = {promotions: []}} = await makePaginatedRequest(context, endpoint, options);
    return dispatch(Actions.LOAD_SEQUENCE_SUCCESS, {json, sequenceName});
  } catch (error) {
    return dispatch(Actions.LOAD_SEQUENCE_FAILURE, {sequenceName});
  }
}

export async function readAdminPromotionListExpired(context, payload = {}) {
  const {dispatch} = context;
  const sequenceName = AdminPromotionListExpiredStore.sequenceName;
  try {
    const endpoint = URI.expand(ADMIN_PROMOTION_ENDPOINT.readList, {
      filter: {'filter[expired]': true}
    }).href();
    const options = {...payload, version: 2, sequenceName};
    const {body: json = {promotions: []}} = await makePaginatedRequest(context, endpoint, options);
    return dispatch(Actions.LOAD_SEQUENCE_SUCCESS, {json, sequenceName});
  } catch (error) {
    return dispatch(Actions.LOAD_SEQUENCE_FAILURE, {sequenceName});
  }
}

export async function updateAdminPromotion(context, payload) {
  const {dispatch, executeAction} = context;
  const {id, promotion} = payload;
  const rIO = {id, type: PromotionStore.type};
  try {
    const endpoint = URI.expand(ADMIN_PROMOTION_ENDPOINT.update, {id}).href();
    const query = {promotion};
    const options = {query, version: 2};
    dispatch(Actions.UPDATE_START, rIO);
    const {body: json} = await makeAuthorizedRequest('patch', endpoint, options, context);
    dispatch(Actions.UPDATE_SUCCESS, {...rIO, json});
    return await executeAction(pushHistoryState, ['/admin/promotions']);
  } catch (error) {
    handleError(error, context, {action: Actions.UPDATE_FAILURE, actionOptions: rIO});
  }
}



// WEBPACK FOOTER //
// ./src/main/app/actions/AdminPromotionActionCreators.js