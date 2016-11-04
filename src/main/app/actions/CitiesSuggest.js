import {Actions} from '../actions/Constants';
import {makeAuthorizedRequest} from '../utils/ActionUtils';
import {getSequenceClass} from '../utils/StoreUtils';

export async function loadCitiesSuggest(context, {sequenceName, term, withCountries = false}) {
  const endpoint = '/locations';
  const options = {
    version: 2,
    query: withCountries ? {term} : {term, type: 'cities'}
  };
  const sequence = context.getStore(getSequenceClass(sequenceName));

  context.dispatch(Actions.SET_SEQUENCE_INFO, {
    data: {lastTerm: term, isSyncing: true},
    sequenceName
  });
  const {body: json} = await makeAuthorizedRequest('get', endpoint, options, context);
  if (sequence.getInfo('lastTerm') === term) {
    context.dispatch(Actions.LOAD_SEQUENCE_SUCCESS, {json, key: 'locations', sequenceName});
  }
  return json.locations;
}

export function clearCitiesSuggest(context, {sequenceName}) {
  return context.dispatch(Actions.CLEAR_SEQUENCES, {sequenceNames: [sequenceName]});
}



// WEBPACK FOOTER //
// ./src/main/app/actions/CitiesSuggest.js