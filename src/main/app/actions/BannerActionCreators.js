import {Actions} from '../actions/Constants';
import {makeAuthorizedRequest} from '../utils/ActionUtils';
import {BannersStore} from '../stores/SequenceStores';

export async function loadBanners(context) {
  const {body: json} = await makeAuthorizedRequest('get', '/banners', {version: 2}, context);
  return context.dispatch(Actions.LOAD_SEQUENCE_SUCCESS, {
    json, sequenceName: BannersStore.sequenceName
  });
}



// WEBPACK FOOTER //
// ./src/main/app/actions/BannerActionCreators.js