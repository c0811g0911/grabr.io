import {Actions} from '../actions/Constants';
import {LocalStore} from '../stores/LocalStore';
import {makeAuthorizedRequest, makePaginatedRequest} from '../utils/ActionUtils';
import {MyNotificationsStore} from '../stores/SequenceStores';
import {subscribeMessageBus} from '../utils/APIUtils';
import {AppStore} from '../stores/AppStore';

export function loadMyNotifications(context, payload) {
  const {append, pageNumber, pageSize} = payload;
  return makePaginatedRequest(context, '/notifications', {
    append,
    pageNumber,
    pageSize,
    sequenceName: MyNotificationsStore.sequenceName,
    version: 2
  });
}
export async function markAllNotificationsAsRead(context) {
  const {dispatch} = context;
  const endpoint = '/notifications/read';
  const options = {version: 2};
  const {body: {unread_notifications_count}} = await makeAuthorizedRequest('post', endpoint, options, context);
  return dispatch(Actions.CHANGE_COUNT, {counters: {unread_notifications_count}});
}

export function startPolling(context) {
  const {dispatch, getStore} = context;
  const authToken = getStore(LocalStore).get('AUTH_TOKEN');
  const {config: {apiRoot}} = getStore(AppStore).getState();
  if (authToken) {
    subscribeMessageBus('/notifications', function (json) {
      if (json && json.notification) {
        dispatch(Actions.LOAD_SEQUENCE_SUCCESS, {
          json,
          append: true,
          sequenceName: 'my_notifications'
        });

        dispatch(Actions.SHOW_ALERT, {data: json});

        dispatch(Actions.CHANGE_COUNT, {
          counters: {
            unread_notifications_count: json.notification.unread_notifications_count
          }
        });
      }
    }, authToken, apiRoot);
  }
}



// WEBPACK FOOTER //
// ./src/main/app/actions/NotificationActionCreators.js