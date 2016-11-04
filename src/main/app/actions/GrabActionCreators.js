import _, {pickBy, mapKeys} from 'lodash';
import {Actions} from '../actions/Constants';
import {handleError} from '../utils/handleError';
import {AccountStore} from '../stores/AccountStore';
import {changeState} from '../utils/stateMachines';
import {del, post} from '../utils/APIUtils';
import {
  facebookPixelTrackAcceptOffer,
  facebookPixelTrackGrabCreationFinished,
  facebookPixelTrackMakeOfferFinished
} from '../../3rd-party/facebook/FacebookPixelEvents';
import {
  googleAnalyticsTrackGrabCreationFinished,
  googleAnalyticsTrackMakeOfferFinished
} from '../../3rd-party/google/GoogleAnalyticsEvents';
import {GRAB_AGGREGATE_STATE, shapeGrab} from '../models/GrabModel';
import {GrabStore, OfferStore, ItemStore} from '../stores/DataStores';
import {LocalStore} from '../stores/LocalStore';
import {makeAuthorizedRequest, makePaginatedRequest} from '../utils/ActionUtils';
import {
  mixpanelTrackGrabCreationFinished,
  mixpanelTrackGrabPublishFinished,
  mixpanelTrackItemCreationFinished
} from '../../3rd-party/mixpanel/MixpanelEvents';
import {
  MyActiveGrabsStore,
  MyDraftGrabsStore,
  MyFinishedGrabsStore,
  MyPendingGrabsStore,
  ParticipantStore,
  RecentGrabsStore,
  RelatedGrabsStore
} from '../stores/SequenceStores';
import URI from 'urijs';
import {AppStore} from '../stores/AppStore';
import {pushHistoryState} from './HistoryActionCreators';
import {loadItem, getItemFromUrl} from './ItemActionCreators';
import {FormStore} from '../stores/FormStore';
import {resetForm} from './FormActionCreators';
import {grabDescriptionSchema} from '../renderers/grab_description';
import {grabDeliverySchema} from '../renderers/grab_delivery';
import {grabSummarySchema} from '../renderers/grab_summary';
import {matchErrorsByClass} from '../api-errors/matchErrors';
import {ErrorClass} from '../api-errors/ErrorClass';
import {ErrorTypeAuthorization} from '../api-errors/ErrorTypeAuthorization';
import {ErrorTypeSift} from '../api-errors/ErrorTypeSift';
import {ErrorTypeStripe} from '../api-errors/ErrorTypeStripe';
import {setFormErrors} from '../actions/AppActionCreators';
import {intercomOpenChat} from '../utils/IntercomUtils';

function getType(attributes) {
  if (attributes.fromShop) {
    return 'from_shop';
  } else if (attributes.shopUrl) {
    return 'from_url';
  }
  return 'manual';
}

function getAnalyticsObject(attributes, error = null) {
  return Object.assign({
    type: getType(attributes),
    itemId: attributes.itemId,
    itemTitle: attributes.title,
    url: attributes.url
  }, error ? {error} : {});
}

export function loadRecentGrabs(context, {pageSize, pageNumber = 0, append = false, filters = {}}) {
  return makePaginatedRequest(context, '/grabs', {
    pageSize, pageNumber, append,
    version: 2, query: {sort: '-created', filter: filters},
    sequenceName: RecentGrabsStore.sequenceName,
    done: (err, json) => {
      if (json && json.meta) {
        context.dispatch(Actions.LOAD_DATA_SUCCESS, {json: json.meta});
      }
    }
  });
}

export function loadRelatedGrabs(context, {count}) {
  return makePaginatedRequest(context, '/grabs', {
    version: 2, pageNumber: 0, pageSize: count,
    query: {sort: '-created'},
    sequenceName: RelatedGrabsStore.sequenceName
  });
}

export function loadGrab(context, payload) {
  const {id, loadOffers = false} = payload;

  if (loadOffers) {
    return Promise.all([readGrab(context, {id}), readOfferList(context, {id})]);
  } else {
    return readGrab(context, {id});
  }

  async function readGrab(context, payload) {
    const {dispatch} = context;
    const {id} = payload;
    const endpoint = URI.expand('/grabs{/id}', {id}).href();
    const options = {version: 2};
    const {body: json} = await makeAuthorizedRequest('get', endpoint, options, context);
    dispatch(Actions.LOAD_DATA_SUCCESS, {json});
    return dispatch(Actions.LOAD_DATA_ITEM, {id, storeName: GrabStore.storeName});
  }

  async function readOfferList(context, payload) {
    const {dispatch} = context;
    const {id} = payload;
    const endpoint = URI.expand('/grabs{/id}/offers', {id}).href();
    const options = {version: 2};
    const {body: json = {offers: []}} = await makeAuthorizedRequest('get', endpoint, options, context);
    return dispatch(Actions.LOAD_INCLUDED_SUCCESS, {
      includedType: OfferStore.type,
      json,
      rootId: id,
      rootType: GrabStore.type
    });
  }
}

export function createGrab(context, {attributes, step}, done) {
  let query;
  switch (step) {
    case 0:
      // select properties object
      const isProperty = (value, key) => key.match('_property_');
      const properties = mapKeys(pickBy(attributes, isProperty), (value, key) => key.replace('_property_', ''));

      const {itemId} = attributes;
      const item = itemId ? context.getStore(ItemStore).get(itemId) : null;

      query = {
        grab: {
          item: {
            title: attributes.title,
            description: attributes.description,
            estimate_price_cents: attributes.estimate_price_cents,
            image_file_ids: attributes.images.map(image => image.file_id || image.id),
            shop_url: attributes.shop_url,
            parent_item_id: attributes.itemId,
            properties
          },
          quantity: attributes.quantity,
          from_id: item && item.get('from') ? item.get('from').get('id') : null
        }
      };
      break;
    case 1:
      query = {
        grab: {
          to_id: attributes.to && (attributes.to.id || attributes.to.get('id')),
          from_id: attributes.from && (attributes.from.id || attributes.from.get('id')),
          due_date: attributes.due_date,
          reward_cents: attributes.reward_cents
        }
      };
      break;
    case 2:
      query = {
        grab: {
          comment: attributes.comment,
          publish: true
        }
      };
      break;
  }

  const method = attributes.id ? () => makeAuthorizedRequest('patch', `/grabs/${ attributes.id }`, {
    query,
    version: 2
  }, context) : () => makeAuthorizedRequest('post', '/grabs', {query, version: 2}, context);

  context.dispatch(Actions.START_SYNC);

  const callback = () => {
    method().then(res => {
      context.dispatch(Actions.LOAD_DATA_SUCCESS, {json: res.body});
      if (step !== 2) {
        const grab = context.getStore(GrabStore).get(res.body.grab.id);
        const item = grab.get('item');
        const from = grab.get('from');
        const to = grab.get('to');

        context.dispatch(Actions.FINISH_SYNC);
        context.dispatch(Actions.UPDATE_ATTRIBUTES, {
          id: grab.get('id'),
          itemId: item.get('id'),
          title: item.get('title'),
          description: item.get('description'),
          properties: item.get('properties'),
          estimate_price_cents: item.get('estimate_price_cents'),
          comment: item.get('comment'),
          to: to ? {id: to.get('id'), query: to.getFullTitle()} : null,
          from: from ? {id: from.get('id'), query: from.getFullTitle()} : null,
          due_date: grab.get('due_date'),
          reward_cents: grab.get('reward_cents'),
          quantity: grab.get('quantity')
        });
      } else {
        context.executeAction(pushHistoryState, ['/grabs/new/success']);
      }

      const {type, url, itemId, itemTitle} = getAnalyticsObject(attributes);
      switch (step) {
        case 0: {
          mixpanelTrackItemCreationFinished(type, url);
          break;
        }
        case 1: {
          mixpanelTrackGrabCreationFinished(type, url, itemId, itemTitle);
          break;
        }
        case 2: {
          {
            const grab = shapeGrab(context.getStore(GrabStore).get(res.body.grab.id));
            const {id, title, quantity, item: {id: itemId}, total: amount, rewardCurrency: currency} = grab;
            facebookPixelTrackGrabCreationFinished({
              grab: {id},
              item: {id: itemId, name: title, quantity},
              total: {amount, currency}
            });
          }
          googleAnalyticsTrackGrabCreationFinished();
          mixpanelTrackGrabPublishFinished(type, url, itemId, itemTitle);
          break;
        }
      }

      context.dispatch(Actions.NEXT_STEP);
      done();
    }).catch(err => {
      handleError(err, context, {
        customHandler: error => {
          context.dispatch(Actions.FINISH_SYNC);

          if (!error.errors) {
            return;
          }
          const authorizationErrors = error.errors.authorization || [];

          if (authorizationErrors.indexOf('unauthorized') !== -1) {
            changeState({type: 'login_open', copy: 'place_order', context, callback});
            return;
          }

          context.dispatch(Actions.UPDATE_ERRORS, error.errors);
        }
      });
    });
  };

  if (!context.getStore(AccountStore).isGuest()) {
    callback();
  } else {
    context.dispatch(Actions.FINISH_SYNC);
    changeState({context, type: 'login_open', copy: 'place_order', callback});
  }
}

export async function updateGrab(context, {attributes}) {
  const {
          id, comment, from, to, due_date, reward_cents, quantity,
          estimate_price_cents, fromShop, itemId, title, description, images
        } = attributes;

  // select properties object
  const isProperty = (value, key) => key.match('_property_');
  const properties = mapKeys(pickBy(attributes, isProperty), (value, key) => key.replace('_property_', ''));

  const query = {
    id,
    comment,
    to_id: to && (to.value || to.get('id')),
    from_id: from && (from.value || from.get('id')),
    due_date,
    reward_cents,
    quantity,
    publish: true,
    ...(fromShop ? {
      item_id: itemId
    } : {
      item: {
        id: itemId,
        title,
        description,
        estimate_price_cents,
        image_file_ids: images.map(image => image.id || image.file_id || image.get('id')),
        properties
      }
    })
  };

  try {
    context.dispatch(Actions.START_SYNC);
    const options = {query: {grab: query}, version: 2};
    const endpoint = URI.expand('/grabs{/id}', {id}).href();
    const {body: {grab: {id: id$}}} = await makeAuthorizedRequest('patch', endpoint, options, context);
    const url = URI.expand('/grabs{/id}', {id: id$}).href();
    context.dispatch(Actions.FINISH_SYNC);
    return context.executeAction(pushHistoryState, [url]);
  } catch (error) {
    handleError(error, context, {
      customHandler: ({errors}) => {
        context.dispatch(Actions.FINISH_SYNC);
        context.dispatch(Actions.UPDATE_ERRORS, errors);
      }
    });
  }
}

export async function loadOffer(context, {offerId, grabId, couponId}) {
  const query = couponId ? {coupon_id: couponId} : {};
  const {body: json} = await makeAuthorizedRequest('get', `/grabs/${ grabId }/offers/${ offerId }`, {
    version: 2,
    query
  }, context);
  context.dispatch(Actions.LOAD_DATA_ITEM, {id: offerId, storeName: OfferStore.storeName});
  return context.dispatch(Actions.LOAD_DATA_SUCCESS, {json});
}

export function makeOffer(context, {grabId, attributes}) {
  attributes.from_id = attributes.from.id || attributes.from.get('id');
  attributes = _.pick(attributes, ['bid_cents', 'comment', 'delivery_date', 'from_id']);

  context.dispatch(Actions.UPDATE_START, {id: grabId, type: 'grabs'});

  const callback = () => {
    makeAuthorizedRequest('post', `/grabs/${ grabId }/offers`, {query: {offer: attributes}, version: 2}, context)
      .then(() => {
        context.executeAction(pushHistoryState, [`/grabs/${ grabId }`]);
        facebookPixelTrackMakeOfferFinished({
          grab: {id: grabId},
          // fixme: oh help us god, currency is hardcoded everywhere!!!
          offer: {amount: attributes.bid_cents / 100, currency: 'USD'}
        });
        googleAnalyticsTrackMakeOfferFinished();
        context.dispatch(Actions.UPDATE_SUCCESS, {id: grabId, type: 'grabs'});
        context.dispatch(Actions.SHOW_ALERT, {data: {custom: true, type: 'offer_success'}});
      })
      .catch(err => {
        handleError(err, context, {
          action: Actions.UPDATE_FAILURE,
          actionOptions: {id: grabId, type: 'grabs'},
          customHandler: error => {
            const matchAuthorization = matchErrorsByClass(error.errors, ErrorClass.AUTHORIZATION);
            if (matchAuthorization()) {
              if (matchAuthorization(ErrorTypeAuthorization.UNAUTHORIZED)) {
                changeState({type: 'login_open', copy: 'make_offer', context, callback});
              } else if (matchAuthorization(ErrorTypeAuthorization.NOT_TRAVELER)) {
                changeState({type: 'become_a_traveler_redirect', copy: 'make_offer', context, callback});
              } else if (matchAuthorization(ErrorTypeAuthorization.UNCONFIRMED_PHONE)) {
                changeState({type: 'phone_open', copy: 'make_offer', context, callback});
              } else if (matchAuthorization(ErrorTypeAuthorization.UNCONFIRMED_EMAIL)) {
                changeState({type: 'email_open', copy: 'make_offer', context});
              }
            } else {
              context.dispatch(Actions.UPDATE_FAILURE, {id: grabId, type: 'grabs', errors: error.errors});
            }
          }
        });
      });
  };
  callback();
}

export function acceptOffer(context, {grabId, offerId, couponId}, done) {
  context.dispatch(Actions.UPDATE_START, {id: offerId, type: 'offers'});

  const redirectUrl = `${ location.origin }/grabs/${ grabId }/offer/${ offerId }/payment`;
  const query = {client_url: redirectUrl};
  if (couponId) {
    query.coupon_id = couponId;
  }
  context.dispatch(Actions.SET_RECORD, {errorMessage: null});

  const callback = () => {
    makeAuthorizedRequest('post', `/grabs/${ grabId }/offers/${ offerId }/acceptance`, {query, version: 2}, context)
      .then(res => {
        /* check for 3D Secure redirect by simply checking for redirect_url existence in body if present, just redirect to this url — anything else will be handled by server OfferPage has a special handling of the final success/failure cases.*/
        if (res.body.redirect_url) {
          location.href = res.body.redirect_url;
        } else {
          context.dispatch(Actions.LOAD_DATA_SUCCESS, {json: res.body});
          context.dispatch(Actions.UPDATE_SUCCESS, {id: offerId, type: 'offers'});

          const grab = shapeGrab(context.getStore(GrabStore).get(grabId));
          const {item: {id, title: name}, quantity, itemPrice, itemPriceCurrency} = grab;
          facebookPixelTrackAcceptOffer({
            item: {id, name, quantity},
            total: {amount: itemPrice, currency: itemPriceCurrency}
          });

          context.dispatch(Actions.SHOW_ALERT, {data: {custom: true, type: 'accept_success'}});
          context.executeAction(pushHistoryState, [`/grabs/${ grabId }`]);
        }
        done();
      })
      .catch(error => {
        handleError(error, context, {
          action: Actions.UPDATE_FAILURE,
          actionOptions: {id: offerId, type: 'offers'},
          customHandler: ({errors}) => {
            const intlMessages = context.getStore(AppStore).getCurrentIntlMessages();
            const matchAuthorization = matchErrorsByClass(errors, ErrorClass.AUTHORIZATION);
            const matchSift = matchErrorsByClass(errors, ErrorClass.SIFT);
            const matchStripe = matchErrorsByClass(errors, ErrorClass.STRIPE);
            if (matchAuthorization()) {
              if (matchAuthorization(ErrorTypeAuthorization.UNCONFIRMED_EMAIL)) {
                changeState({type: 'email_open', copy: 'accept_offer', context});
              } else if (matchAuthorization(ErrorTypeAuthorization.UNCONFIRMED_PHONE)) {
                changeState({type: 'phone_open', copy: 'accept_offer', context, callback});
              } else if (matchAuthorization(ErrorTypeAuthorization.NOT_CONSUMER)) {
                changeState({type: 'payment_open', copy: 'accept_offer', context, callback});
              }
            } else if (matchSift()) {
              let errorMessage;
              if (matchSift(ErrorTypeSift.HOLD)) {
                errorMessage = intlMessages['api_errors.sift.hold'];
                setTimeout(intercomOpenChat, 3e3);
              } else {
                errorMessage = intlMessages['api_errors.sift'];
              }
              context.dispatch(Actions.SET_RECORD, {ERROR_MESSAGE: errorMessage});
            } else if (matchStripe()) {
              let errorMessage;
              if (matchStripe(ErrorTypeStripe.CARD_DECLINED)) {
                errorMessage = intlMessages['api_errors.stripe.card_declined'];
              } else if (matchStripe(ErrorTypeStripe.EXPIRED_CARD)) {
                errorMessage = intlMessages['api_errors.stripe.expired_card'];
              } else if (matchStripe(ErrorTypeStripe.INCORRECT_CVC)) {
                errorMessage = intlMessages['api_errors.stripe.incorrect_cvc'];
              } else if (matchStripe(ErrorTypeStripe.INVALID_REQUEST_ERROR)) {
                errorMessage = intlMessages['api_errors.stripe.invalid_request_error'];
              } else if (matchStripe(ErrorTypeStripe.MISSING)) {
                errorMessage = intlMessages['api_errors.stripe.missing'];
              } else if (matchStripe(ErrorTypeStripe.PROCESSING_ERROR)) {
                errorMessage = intlMessages['api_errors.stripe.processing_error'];
              } else {
                errorMessage = intlMessages['api_errors.stripe'];
              }
              context.dispatch(Actions.SET_RECORD, {ERROR_MESSAGE: errorMessage});
            } else {
              context.dispatch(Actions.SET_RECORD, {
                ERROR_MESSAGE: intlMessages['components.modal_error.unexpected']
              });
            }
          }
        });
        done(error);
      });
  };
  callback();
}

export function cancelOffer(context, {grabId, offerId}, done) {
  const authToken = context.getStore(LocalStore).get('AUTH_TOKEN');
  const {config: {apiRoot}} = context.getStore(AppStore).getState();

  context.dispatch(Actions.DELETE_START, {id: offerId, type: 'offers'});

  del(`/grabs/${ grabId }/offers/${ offerId }`, {}, {authToken, apiRoot}).then(() => {
    context.dispatch(Actions.DELETE_ITEM, {
      id: offerId,
      type: 'offers'
    });

    loadGrab(context, {id: grabId, loadOffers: true}).then(value => done(null, value)).catch(done);
  }).catch(err => {
    handleError(err, context, {
      action: Actions.DELETE_FAILURE,
      actionOptions: {id: offerId, type: 'offers'}
    });
  });
}

export function confirmDelivery(context, {id}) {
  const authToken = context.getStore(LocalStore).get('AUTH_TOKEN');
  const {config: {apiRoot}} = context.getStore(AppStore).getState();

  post(`/grabs/${ id }/confirmation`, {}, {authToken, apiRoot}).then(res => {
    context.dispatch(Actions.LOAD_DATA_SUCCESS, {json: res.body});
  });
}

export function review(context, {id, attributes, formName}, done) {
  const authToken = context.getStore(LocalStore).get('AUTH_TOKEN');
  const {config: {apiRoot}} = context.getStore(AppStore).getState();

  context.executeAction(setFormErrors, {formName, errors: null});
  context.dispatch(Actions.UPDATE_START, {id, type: 'grabs'});

  post(`/grabs/${ id }/review`, {review: attributes}, {authToken, apiRoot}).then(() => {
    loadGrab(context, {id}).then(value => {
      context.dispatch(Actions.UPDATE_SUCCESS, {id, type: 'grabs'});
      done(null, value);
    }).catch(done);
  }).catch(err => {
    let errors = null;

    if (err.response) {
      errors = err.response.body.errors;
    }

    context.executeAction(setFormErrors, {formName, errors});

    handleError(err, context, {
      action: Actions.UPDATE_FAILURE,
      actionOptions: {id, type: 'grabs'}
    });
  });
}

export function cancelReview(context, {formName}) {
  context.executeAction(setFormErrors, {formName, errors: null});
}

export function loadMyGrabs(context, payload) {
  const {append, filters, pageNumber, pageSize} = payload;
  const endpoint = '/account/grabs';
  const options = {
    append,
    pageNumber,
    pageSize,
    query: filters,
    sequenceName: getSequenceName(filters.filter),
    version: 2
  };
  return makePaginatedRequest(context, endpoint, options);

  function getSequenceName(aggregateState) {
    switch (aggregateState) {
      case GRAB_AGGREGATE_STATE.ACTIVE:
        return MyActiveGrabsStore.sequenceName;
      case GRAB_AGGREGATE_STATE.DRAFT:
        return MyDraftGrabsStore.sequenceName;
      case GRAB_AGGREGATE_STATE.FINISHED:
        return MyFinishedGrabsStore.sequenceName;
      case GRAB_AGGREGATE_STATE.PENDING:
        return MyPendingGrabsStore.sequenceName;
      default:
    }
  }
}

export function loadParticipantData(context, {grabId}) {
  context.dispatch(Actions.CLEAR_SEQUENCES, {
    sequenceNames: [ParticipantStore.sequenceName]
  });

  makeAuthorizedRequest('get', `/grabs/${ grabId }/participant`, {version: 2}, context).then(res => {
    context.dispatch(Actions.LOAD_SEQUENCE_SUCCESS, {
      json: res.body,
      sequenceName: ParticipantStore.sequenceName
    });
  }).catch(() => {
  });
}

async function makeGrabTransition(context, payload) {
  const {dispatch} = context;
  const {event, grabId} = payload;
  const rIO = {id: grabId, type: GrabStore.type};

  try {
    const endpoint = URI.expand('/grabs{/grabId}/transitions', {grabId}).href();
    const query = {event};
    const options = {query, version: 2};

    dispatch(Actions.UPDATE_START, rIO);
    const {body: json} = await makeAuthorizedRequest('post', endpoint, options, context);
    dispatch(Actions.LOAD_DATA_SUCCESS, {json});
    return dispatch(Actions.UPDATE_SUCCESS, rIO);
  } catch (error) {
    handleError(error, context, {action: Actions.UPDATE_FAILURE, actionOptions: rIO});
  }
}

export function cancelGrab(context, payload) {
  const {grabId} = payload;
  return makeGrabTransition(context, {event: 'cancel', grabId});
}

export function confirmGrab(context, payload) {
  const {grabId} = payload;
  return makeGrabTransition(context, {event: 'confirm', grabId});
}

export function deliverGrab(context, payload) {
  const {grabId} = payload;
  return makeGrabTransition(context, {event: 'deliver', grabId});
}

export function publishGrab(context, payload) {
  const {grabId} = payload;
  return makeGrabTransition(context, {event: 'publish', grabId});
}

export function transitGrab(context, payload) {
  const {grabId} = payload;
  return makeGrabTransition(context, {event: 'transit', grabId});
}

export function unpublishGrab(context, payload) {
  const {grabId} = payload;
  return makeGrabTransition(context, {event: 'unpublish', grabId});
}

export async function loadNewGrabPage(context, {itemId, quantity, title, url, query}) {
  const {executeAction, getStore} = context;
  const itemQuantity = Number(quantity) || 1;
  const item = itemId ? getStore(ItemStore).get(itemId) : null;

  async function getAttributes() {
    const defaultAttributes = {
      images: [],
      title: '',
      description: '',
      estimate_price_cents: '',
      comment: '',
      to: null,
      from: null,
      due_date: null,
      reward_cents: '',
      quantity: 1
    };
    if (itemId) {
      await executeAction(loadItem, {id: itemId});
      return {
        ...defaultAttributes,
        itemId,
        title: item.get('title'),
        description: item.get('description'),
        estimate_price_cents: item.get('estimate_price_cents'),
        images: item.get('images').map(image => {
          return ({id: image.get('id'), url: image.get('url')});
        }) || [],
        quantity: itemQuantity,
        from: item.get('from') ? {value: item.get('from').get('id'), query: item.get('from').getFullTitle()} : null,
        fromShop: true,
        ...(item.get('properties') || []).reduce((memo, property) => {
          const {key} = property;
          memo[`_property_${key}`] = query[key] || '';
          return memo;
        }, {})
      };
    } else if (url) {
      await executeAction(getItemFromUrl, {url});
      const {description, estimate_price_cents, images, shop_url, title} = getStore(FormStore).getAttributes();
      return {
        ...defaultAttributes,
        ...{
          description,
          estimate_price_cents,
          images: images || [],
          quantity: itemQuantity,
          shop_url,
          title
        }
      };
    } else if (title) {
      return {...defaultAttributes, title};
    }
    return defaultAttributes;
  }

  return context.executeAction(resetForm, {
    schema: {
      0: grabDescriptionSchema,
      1: grabDeliverySchema,
      2: grabSummarySchema
    },
    attributes: await getAttributes()
  });
}

export async function loadGrabEditPage(context, {id}) {
  const defaultAttributes = {
    images: [],
    title: '',
    description: '',
    estimate_price_cents: '',
    comment: '',
    to: null,
    from: null,
    due_date: null,
    quantity: 1
  };

  await context.executeAction(loadGrab, {id});
  const grab = context.getStore(GrabStore).get(id);
  const item = grab.get('item');
  return context.executeAction(resetForm, {
    attributes: {
      ...defaultAttributes,
      id,
      itemId: item.get('id'),
      fromShop: item.get('public'),
      images: item.get('images') || [],
      title: item.get('title'),
      description: item.get('description'),
      estimate_price_cents: grab.get('item_price_cents'),
      comment: grab.get('comment'),
      due_date: grab.get('due_date'),
      reward_cents: grab.get('reward_cents'),
      from: grab.get('from') ?
      {value: grab.get('from').get('id'), query: grab.get('from').getFullTitle()} :
            null,
      to: grab.get('to') ?
      {value: grab.get('to').get('id'), query: grab.get('to').getFullTitle()} :
          null,
      quantity: grab.get('quantity') || 1,
      ...(item.get('properties') || []).reduce((memo, property) => {
        const {key, value} = property;
        memo[`_property_${key}`] = value;
        return memo;
      }, {})
    },
    schema: {
      0: Object.assign(
        {},
        grabDescriptionSchema,
        grabDeliverySchema,
        grabSummarySchema
      )
    }
  });
}



// WEBPACK FOOTER //
// ./src/main/app/actions/GrabActionCreators.js