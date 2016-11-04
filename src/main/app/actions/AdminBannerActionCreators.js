import {Actions} from './Constants';
import {AdminBannerListStore} from '../stores/AdminSequenceStores';
import {BannerStore} from '../stores/DataStores';
import URI from 'urijs';
import {makeAuthorizedRequest, makePaginatedRequest} from '../utils/ActionUtils';

export const ADMIN_BANNER_ENDPOINT = {
  create: '/admin/banners',
  delete: '/admin/banners{/id}',
  read: '/admin/banners{/id}',
  readList: '/admin/banners',
  update: '/admin/banners{/id}',
  updatePositions: '/admin/banners/positions'
};

export async function readAdminBanner(context, payload) {
  const {dispatch} = context;
  const {id} = payload;
  const endpoint = URI.expand(ADMIN_BANNER_ENDPOINT.read, {id}).href();
  const options = {};
  const {body: json} = await makeAuthorizedRequest('get', endpoint, options, context);
  dispatch(Actions.LOAD_DATA_SUCCESS, {json});
  return dispatch(Actions.LOAD_DATA_ITEM, {id, storeName: BannerStore.storeName});
}

export async function readAdminBannerList(context, payload) {
  const {
          append,
          pageNumber,
          pageSize
        } = payload;
  const endpoint = URI.expand(ADMIN_BANNER_ENDPOINT.readList, {}).href();
  const options = {
    append,
    pageNumber,
    pageSize,
    sequenceName: AdminBannerListStore.sequenceName
  };
  return await makePaginatedRequest(context, endpoint, options);
}

export async function createAdminBanner(context, payload) {
  const {dispatch} = context;
  const {
          id,
          image,
          lead,
          redTitle,
          smallTitle,
          targetUrl,
          title
        } = payload;
  const rIO = {id, type: BannerStore.type};
  try {
    const endpoint = URI.expand(ADMIN_BANNER_ENDPOINT.create, {}).href();
    const query = {
      banner: {
        image_file_id: image.fileId,
        lead,
        red_title: redTitle,
        small_title: smallTitle,
        target_url: targetUrl,
        title
      }
    };
    const options = {query};

    dispatch(Actions.CREATE_START, rIO);
    const {body: json} = await makeAuthorizedRequest('post', endpoint, options, context);
    return dispatch(Actions.CREATE_SUCCESS, {...rIO, json});
  } catch (error) {
    return dispatch(Actions.CREATE_FAILURE, rIO);
  }
}

export async function updateAdminBanner(context, payload) {
  const {dispatch} = context;
  const {
          id,
          image,
          lead,
          redTitle,
          smallTitle,
          targetUrl,
          title
        } = payload;
  const rIO = {id, type: BannerStore.type};
  try {
    const endpoint = URI.expand(ADMIN_BANNER_ENDPOINT.update, {id}).href();
    const query = {
      banner: {
        image_file_id: image.fileId,
        lead,
        red_title: redTitle,
        small_title: smallTitle,
        target_url: targetUrl,
        title
      }
    };
    const options = {query};

    dispatch(Actions.UPDATE_START, rIO);
    const {body: json} = await makeAuthorizedRequest('patch', endpoint, options, context);
    return dispatch(Actions.UPDATE_SUCCESS, {...rIO, json});
  } catch (error) {
    return dispatch(Actions.UPDATE_FAILURE, rIO);
  }
}

export async function deleteAdminBanner(context, payload) {
  const {dispatch} = context;
  const {id} = payload;
  const rIO = {id, type: BannerStore.type};
  try {
    const endpoint = URI.expand(ADMIN_BANNER_ENDPOINT.delete, {id}).href();
    const options = {};

    dispatch(Actions.DELETE_START, rIO);
    await makeAuthorizedRequest('del', endpoint, options, context);
    return dispatch(Actions.DELETE_SUCCESS, rIO);
  } catch (error) {
    return dispatch(Actions.DELETE_FAILURE, rIO);
  }
}

export async function updateAdminBannerListPositions(context, payload) {
  const {ids} = payload;
  const endpoint = ADMIN_BANNER_ENDPOINT.updatePositions;
  const query = {ids};
  const options = {query};
  return await makeAuthorizedRequest('post', endpoint, options, context);
}



// WEBPACK FOOTER //
// ./src/main/app/actions/AdminBannerActionCreators.js