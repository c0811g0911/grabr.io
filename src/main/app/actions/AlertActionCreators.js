import {Actions} from '../actions/Constants';

export function showAlert(context, {content}) {
  return context.dispatch(Actions.SHOW_ALERT, {content});
}

export function hideAlert(context, {id}) {
  return context.dispatch(Actions.HIDE_ALERT, {id});
}



// WEBPACK FOOTER //
// ./src/main/app/actions/AlertActionCreators.js