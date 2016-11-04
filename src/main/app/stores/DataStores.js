import _ from 'lodash';
import {Actions} from '../actions/Constants';
import moment from 'moment';
import {DataStore, Instance} from './DataStore';
import {AppStore} from './AppStore';
import {AccountStore} from './AccountStore';
import {GRAB_AGGREGATE_STATE, GRAB_STATE} from '../models/GrabModel';

class GrabInstance extends Instance {
  getFrom() {
    const from = this.get('from');
    return from ? from.getTitle() : this._store._dispatcher.getStore(AppStore).getCurrentIntlMessages()['shared.anywhere'];
  }

  getTo() {
    const to = this.get('to');
    return to ? to.getTitle() : '';
  }

  isActive() {
    return this.get('aggregate_state') === GRAB_AGGREGATE_STATE.ACTIVE;
  }

  isDelivered() {
    return this.get('state') === GRAB_STATE.DELIVERED;
  }

  isDraft() {
    return this.get('aggregate_state') === GRAB_AGGREGATE_STATE.DRAFT;
  }

  isFinished() {
    return this.get('aggregate_state') === GRAB_AGGREGATE_STATE.FINISHED;
  }

  isPending() {
    return this.get('aggregate_state') === GRAB_AGGREGATE_STATE.PENDING;
  }

  hasReview(user) {
    if (!user) {
      return false;
    }
    const reviews = this.get('reviews').filter(review => {
      return review.get('reviewer').isSame(user);
    });
    return reviews.length > 0;
  }

  getConsumer() {
    return this.get('consumer');
  }

  isConsumer(user) {
    return this.getConsumer() && this.getConsumer().isSame(user);
  }

  getAcceptedGrabber() {
    return this.get('accepted_grabber');
  }

  isAcceptedGrabber(user) {
    return this.getAcceptedGrabber() && this.getAcceptedGrabber().isSame(user);
  }

  getAcceptedOffer() {
    return this.get('accepted_offer');
  }

  getTitleImage() {
    return this.get('image') && this.get('image').get('url');
  }

  getGrabberOffer(grabber) {
    if (!grabber || !grabber.get || !this.get('offers')) {
      return null;
    }
    const grabberOffers = this.get('offers').filter(offer => {
      return offer.get('grabber').get('id') === grabber.get('id');
    });
    return grabberOffers[0] || null;
  }

  getItem() {
    return this.get('item');
  }

  getItemPrice() {
    return (this.get('quantity') || 1) * this.get('item_price_cents');
  }
}

export class GrabStore extends DataStore {
  static storeName = 'GrabStore';
  static type = 'grab';
  static handlers = {};
  static defaults = {
    item_ids: []
  };
  static InstanceClass = GrabInstance;

  static transformers = [
    json => {
      if (json.from_id) {
        delete json.from_id;
      }
      if (json.to_id) {
        delete json.to_id;
      }
    }
  ];
}

export class CityInstance extends Instance {
  getTitle() {
    return this.get('name');
  }

  getFullTitle() {
    return `${ this.get('name') }, ${ this.get('country_alpha2') }`;
  }
}

export class CityStore extends DataStore {
  static storeName = 'CityStore';
  static type = 'city';
  static handlers = {};
  static InstanceClass = CityInstance;
}

class CountryInstance extends Instance {
  getTitle() {
    return this.get('name');
  }

  getFullTitle() {
    return this.get('name');
  }

  getPayoutType() {
    return (this.get('payout_options') || ['stripe'])[0];
  }
}

export class CountryStore extends DataStore {
  static storeName = 'CountryStore';
  static type = 'country';
  static handlers = {};
  static InstanceClass = CountryInstance;
}

class MessageInstance extends Instance {
  isSentBy(user) {
    return this.get('sender') && this.get('sender').isSame(user);
  }
}

export class MessageStore extends DataStore {
  static storeName = 'MessageStore';
  static type = 'message';
  static handlers = {};
  static InstanceClass = MessageInstance;
}

class UserInstance extends Instance {
  isCurrent() {
    const currentUser = this._store._dispatcher.getStore(AccountStore).getUser();

    return currentUser ? this.get('id') === currentUser.get('id') : false;
  }

  getId() {
    return this.get('id');
  }

  getFullName() {
    return `${ this.get('first_name') } ${ this.get('last_name') }`;
  }

  getName() {
    return this.get('first_name');
  }

  isAdmin() {
    return this.get('admin');
  }

  isBlocked() {
    return this.get('blocked');
  }

  isEmailConfirmed() {
    return this.get('email') && this.get('email').confirmed;
  }

  isPhoneConfirmed() {
    return this.get('phone') && this.get('phone').confirmed;
  }

  isSame(user) {
    return user && user.get && user.get('type') === this.get('type') && this.get('id') === user.get('id');
  }

  isGuest() {
    return Boolean(this.get('guest'));
  }

  getPhone() {
    return this.get('phone') || {};
  }

  hasPhone() {
    return this.get('phone') && this.get('phone').number;
  }

  hasEmail() {
    return this.get('email') && this.get('email').address;
  }

  getEmail() {
    return this.get('email') && this.get('email').address;
  }

  needsSSN() {
    return this.get('verification') && this.get('verification').fields_needed.indexOf('ssn_last_4') !== -1;
  }

  getVerification() {
    return this.get('verification') || {};
  }

  getAvatar() {
    return this.get('avatar_url');
  }
}

export class UserStore extends DataStore {
  static storeName = 'UserStore';
  static type = 'user';
  static handlers = {};
  static InstanceClass = UserInstance;
}

class TravelerInstance extends Instance {
  hasBankAccount() {
    return this.get('bank_account');
  }

  getAddress() {
    return this.get('address') || {};
  }

  getBankAccount() {
    return this.get('bank_account') || {};
  }
}

export class TravelerProfileStore extends DataStore {
  static storeName = 'TravelerProfileStore';
  static type = 'traveler_profile';
  static handlers = {};
  static InstanceClass = TravelerInstance;
}

class ConsumerProfileInstance extends Instance {
  getCreditCard() {
    return this.get('credit_card') || {};
  }

  hasCreditCard() {
    return this.get('credit_card');
  }
}

export class ConsumerProfileStore extends DataStore {
  static storeName = 'ConsumerProfileStore';
  static type = 'consumer_profile';
  static handlers = {};
  static InstanceClass = ConsumerProfileInstance;
}

class ItemInstance extends Instance {
  isFromShop() {
    return this.get('public');
  }

  getFrom() {
    const from = this.get('from');
    return from ? from.getTitle() : this._store._dispatcher.getStore(AppStore).getCurrentIntlMessages()['shared.anywhere'];
  }

  getMainImage() {
    return (this.get('image_urls') || [])[0] || null;
  }
}

export class GrabItemStore extends DataStore {
  static storeName = 'GrabItemStore';
  static type = 'grab_item';
  static handlers = {};
}

export class ItemStore extends DataStore {
  static storeName = 'ItemStore';
  static type = 'item';
  static handlers = {};
  static InstanceClass = ItemInstance;
}

export class ImageStore extends DataStore {
  static storeName = 'ImageStore';
  static type = 'image';
  static handlers = {};
}

class OfferInstance extends Instance {
  isCreatedBy(user) {
    return user && user.isSame(this.get('grabber'));
  }
}

export class OfferStore extends DataStore {
  static storeName = 'OfferStore';
  static type = 'offer';
  static handlers = {};
  static InstanceClass = OfferInstance;
}

export class NotificationStore extends DataStore {
  static storeName = 'NotificationStore';
  static type = 'notification';
  static handlers = {};
}

export class ReviewStore extends DataStore {
  static storeName = 'ReviewStore';
  static type = 'review';
  static handlers = {};
}

export class GrabTransitionStore extends DataStore {
  static storeName = 'GrabTransitionStore';
  static type = 'grab_transition';
  static handlers = {};
}

export class CategoryStore extends DataStore {
  static storeName = 'CategoryStore';
  static type = 'category';
  static handlers = {};
}

export class CollectionStore extends DataStore {
  static storeName = 'CollectionStore';
  static type = 'collection';
  static handlers = {};
}

export class TagStore extends DataStore {
  static storeName = 'TagStore';
  static type = 'tag';
  static handlers = {};
}

export class PromotionStore extends DataStore {
  static storeName = 'PromotionStore';
  static type = 'promotion';
  static handlers = {};
}

export class ConversationStore extends DataStore {
  static storeName = 'ConversationStore';
  static type = 'conversation';
  static handlers = {
    [Actions.REMOVE_MESSAGE]: 'handleRemoveMessage',
    [Actions.LOAD_POLLED_MESSAGE]: 'handleLoadPolledMessage',
    [Actions.MARK_CONVERSATION_AS_READ]: 'handleMarkConversationAsRead'
  };

  static defaults = {
    message_ids: []
  };

  handleRemoveMessage({conversationId, id}) {
    this.get(conversationId).remove('messages', id);
    this.emitChange();
  }

  handleLoadPolledMessage({json}) {
    this._dispatcher.getStore(MessageStore).loadFromJSON(json);

    const conversation = this.get(json.message.conversation_id);

    conversation.add('messages', json.message.id);
    if (!json.message.read) {
      conversation.setAttribute('unread_messages_count', conversation.get('unread_messages_count') + 1);
      conversation.setRelation('last_message', {id: json.message.id, type: 'messages'});
    }
    this.emitChange();
  }

  handleMarkConversationAsRead({id}) {
    this.get(id).get('messages').forEach(message => {
      message.setAttribute('read', moment().format());
    });
    this.emitChange();
  }
}

class ItinerarySubscriptionInstance extends Instance {
  getFrom() {
    const from = this.get('from');
    return from ? from.getTitle() : this._store._dispatcher.getStore(AppStore).getCurrentIntlMessages()['shared.anywhere'];
  }

  getTo() {
    const to = this.get('to');
    return to ? to.getTitle() : this._store._dispatcher.getStore(AppStore).getCurrentIntlMessages()['shared.anywhere'];
  }

  // The horror
  isSame(name, id) {
    return !this.get(name) && !id || this.get(name) && this.get(name).get('id') === Number(id);
  }
}

export class ItinerarySubscriptionStore extends DataStore {
  static storeName = 'ItinerarySubscriptionStore';
  static type = 'itinerary_subscription';
  static handlers = {};
  static InstanceClass = ItinerarySubscriptionInstance;

  getByItinerary({fromId, toId}) {
    return _.find(this.getAll(), itinerary => itinerary.isSame('to', toId) && itinerary.isSame('from', fromId));
  }
}

export class PartnerStore extends DataStore {
  static storeName = 'PartnerStore';
  static type = 'partner';
  static handlers = {};
}

export class PaypalProfileStore extends DataStore {
  static storeName = 'PaypalProfileStore';
  static type = 'paypal_profile';
  static handlers = {};
}

export class StripeProfileStore extends DataStore {
  static storeName = 'StripeProfileStore';
  static type = 'stripe_profile';
  static handlers = {};
}

export class CouponStore extends DataStore {
  static storeName = 'CouponStore';
  static type = 'coupon';
  static handlers = {};
}

export class BannerStore extends DataStore {
  static storeName = 'BannerStore';
  static type = 'banner';
  static handlers = {};
}

export const dataStores = [
  BannerStore,
  CategoryStore,
  CityStore,
  CollectionStore,
  ConsumerProfileStore,
  ConversationStore,
  CountryStore,
  CouponStore,
  GrabItemStore,
  GrabStore,
  GrabTransitionStore,
  ImageStore,
  ItemStore,
  ItinerarySubscriptionStore,
  MessageStore,
  NotificationStore,
  OfferStore,
  PartnerStore,
  PaypalProfileStore,
  PromotionStore,
  ReviewStore,
  StripeProfileStore,
  TagStore,
  TravelerProfileStore,
  UserStore
];



// WEBPACK FOOTER //
// ./src/main/app/stores/DataStores.js