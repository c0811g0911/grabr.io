import {Actions} from '../actions/Constants';
import {handleError} from '../utils/handleError';
import {makeAuthorizedRequest} from '../utils/ActionUtils';
import {changeState} from '../utils/stateMachines';
import {MyItinerarySubscriptionsStore} from '../stores/SequenceStores';

export function createSubscription(context, {id, fromId, toId}, done) {
  context.dispatch(Actions.CREATE_START, {
    id,
    type: 'itinerary_subscription',
    json: {
      from_id: fromId,
      to_id: toId
    }
  });

  const callback = () => {
    makeAuthorizedRequest('post', '/itineraries', {
      query: {
        itinerary_subscription: {
          from_id: fromId,
          to_id: toId
        }
      },
      version: 2
    }, context).then(res => {
      context.dispatch(Actions['UPDATE_INSTANCE'], {
        id,
        type: 'itinerary_subscription',
        json: res.body
      });
      done();
    }).catch(err => {
      handleError(err, context, {
        action: Actions['CREATE_FAILURE'],
        actionOptions: {id, type: 'itineraries'},
        customHandler: error => {
          if (!error.errors) {
            return;
          }
          const authorizationErrors = error.errors.authorization;

          if (authorizationErrors.indexOf('unauthorized') !== -1) {
            changeState({type: 'login_open', copy: 'itinerary_subscribe', context, callback});
          }
        }
      });
      done();
    });
  };

  callback();
}

export function loadItinerarySubscriptions(context, {}) {
  return makeAuthorizedRequest('get', '/itineraries', {version: 2}, context).then(res => {
    context.dispatch(Actions.LOAD_SEQUENCE_SUCCESS, {
      json: res.body,
      sequenceName: MyItinerarySubscriptionsStore.sequenceName
    });
  });
}

export function unsubscribe(context, {id}, done) {
  context.dispatch(Actions.DELETE_START, {id, type: 'itineraries'});

  makeAuthorizedRequest('del', `/itineraries/${ id }`, {version: 2}, context).then(() => {
    context.dispatch(Actions.REMOVE_FROM_SEQUENCE, {
      id, sequenceName: MyItinerarySubscriptionsStore.sequenceName
    });
    context.dispatch(Actions.DELETE_SUCCESS, {
      id, type: 'itineraries'
    });
  }).catch(err => {
    handleError(err, context, {
      action: Actions.DELETE_FAILURE,
      actionOptions: {
        id,
        type: 'itineraries'
      }
    });
    done();
  });
}



// WEBPACK FOOTER //
// ./src/main/app/actions/ItineraryActionCreators.js