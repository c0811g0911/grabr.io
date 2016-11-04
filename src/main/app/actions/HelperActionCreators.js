import {get} from '../utils/APIUtils';
import {getAuthToken, makeAuthorizedRequest} from '../utils/ActionUtils';
import {Actions} from '../actions/Constants';
import {AllCountriesStore, TravelerCountriesStore} from '../stores/SequenceStores';
import {AppStore} from '../stores/AppStore';

export function loadCountries(context, {traveler}, done) {
  const authToken = getAuthToken(context);
  const {config: {apiRoot}} = context.getStore(AppStore).getState();

  const query = traveler ? {} : {all: true};

  get('/countries', query, {apiRoot, authToken, version: 2}).then(res => {
    if (traveler) {
      context.dispatch(Actions.LOAD_SEQUENCE_SUCCESS, {
        json: res.body,
        sequenceName: traveler ? TravelerCountriesStore.sequenceName : AllCountriesStore.sequenceName
      });
    }
    context.dispatch(Actions.LOAD_SEQUENCE_SUCCESS, {
      json: res.body,
      sequenceName: AllCountriesStore.sequenceName
    });
    done();
  });
}

export async function loadCountriesV2(context) {
  const {body: json} = await makeAuthorizedRequest('get', '/locations', {
    query: {type: 'countries'},
    version: 2
  }, context);
  context.dispatch(Actions.LOAD_SEQUENCE_SUCCESS, {
    json,
    key: 'locations',
    sequenceName: AllCountriesStore.sequenceName
  });
}



// WEBPACK FOOTER //
// ./src/main/app/actions/HelperActionCreators.js