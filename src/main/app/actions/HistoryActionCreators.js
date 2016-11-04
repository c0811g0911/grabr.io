import {Actions} from '../actions/Constants';

function updateLocation(method) {
  return function (context, args) {
    context.dispatch(Actions.CALL_HISTORY_METHOD, {method, args});
  };
}

export const pushHistoryState = updateLocation('push');
export const replaceHistoryState = updateLocation('replace');

export function setHistory(context, {history}) {
  context.dispatch(Actions.SET_HISTORY, {history});
}

export function changeLocation(context, {location}) {
  context.dispatch(Actions.CHANGE_LOCATION, {location});
}



// WEBPACK FOOTER //
// ./src/main/app/actions/HistoryActionCreators.js