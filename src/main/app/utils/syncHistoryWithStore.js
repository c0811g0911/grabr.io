import {setHistory, changeLocation} from '../actions/HistoryActionCreators';

export function syncHistoryWithStore(history, context) {
  context.executeAction(setHistory, {history});
  history.listen(handleLocationChange);

  function handleLocationChange(location) {
    // Tell the store to update by dispatching an action
    context.executeAction(changeLocation, {location});
  }

  return history;
}



// WEBPACK FOOTER //
// ./src/main/app/utils/syncHistoryWithStore.js