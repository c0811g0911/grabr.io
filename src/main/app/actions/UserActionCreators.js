import {Actions} from '../actions/Constants';
import {AccountStore} from '../stores/AccountStore';
import {makeAuthorizedRequest} from '../utils/ActionUtils';
import {UserStore} from '../stores/DataStores';
import {UserReviewsStore} from '../stores/SequenceStores';
import URI from 'urijs';

export async function loadUser(context, payload) {
  const {dispatch, getStore} = context;
  const {id} = payload;
  const isAdmin = getStore(AccountStore).isAdmin();
  const isCurrent = getStore(AccountStore).isCurrentId(id);

  if (isCurrent) {
    const endpoint = '/account';
    const options = {version: 2};
    const {body: json} = await makeAuthorizedRequest('get', endpoint, options, context);
    dispatch(Actions.LOAD_ACCOUNT_SUCCESS, json.account);
  } else {
    let endpoint;
    if (isAdmin) {
      endpoint = URI.expand('/admin/users{/id}', {id}).href();
    } else {
      endpoint = URI.expand('/users{/id}', {id}).href();
    }
    const options = {version: 2};
    const {body: json} = await makeAuthorizedRequest('get', endpoint, options, context);
    dispatch(Actions.LOAD_DATA_SUCCESS, {json});
  }
  return dispatch(Actions.LOAD_DATA_ITEM, {id, storeName: UserStore.storeName});
}

export async function loadUserReviews(context, payload) {
  const {id, type} = payload;
  return await Promise.all([loadUser(context, {id}), readUserReviewList(context, {id, type})]);

  async function readUserReviewList(context, payload) {
    const {dispatch} = context;
    const {id, type} = payload;
    const endpoint = URI.expand('/users{/id}/evaluations', {id}).href();
    let query;
    if (type === 'traveler') {
      query = {filter: 'grabber'};
    } else {
      query = {filter: type};
    }
    const options = {query, version: 2};
    const {body: json} = await makeAuthorizedRequest('get', endpoint, options, context);
    dispatch(Actions.LOAD_SEQUENCE_SUCCESS, {json, sequenceName: UserReviewsStore.sequenceName, key: 'evaluations'});
  }
}



// WEBPACK FOOTER //
// ./src/main/app/actions/UserActionCreators.js