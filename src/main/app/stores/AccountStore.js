import {Actions} from '../actions/Constants';
import uuid from 'node-uuid';
import {BaseStore} from 'fluxible/addons';
import {isNumber} from 'lodash';
import {UserStore, TravelerProfileStore, ConsumerProfileStore} from './DataStores';
import {CounterStore} from './CounterStore';
import {DataStore} from './DataStore';

export class AccountStore extends BaseStore {
  static storeName = 'AccountStore';

  static handlers = {
    [Actions.LOAD_ACCOUNT_START]: 'handleLoadAccountStart',
    [Actions.LOAD_ACCOUNT_SUCCESS]: 'handleLoadAccountSuccess',
    [Actions.LOAD_ACCOUNT_FAILURE]: 'handleLoadAccountFailure',
    [Actions.UPDATE_ACCOUNT]: 'handleUpdateAccount',
    [Actions.BECOME_TRAVELER]: 'handleBecomeTraveler'
  };

  constructor(dispatcher) {
    super(dispatcher);

    const id = uuid.v4();

    dispatcher.getStore(UserStore).loadFromJSON({user: {id, type: 'users', guest: true}});

    this._user_id = id;
    this._traveler_id = null;
    this._consumer_id = null;
    this._dispatcher = dispatcher;
    this._errors = {};
  }

  // handlers
  //
  handleLoadAccountStart() {
    this._startSync();
    this._errors = {};
    this.emitChange();
  }

  handleLoadAccountSuccess(json) {
    this._updateData(json);
  }

  handleLoadAccountFailure({errors = {}}) {
    this._failSync(errors);
    this.emitChange();
  }

  handleUpdateAccount(json) {
    this._updateData(json);
  }

  // private methods
  //
  _updateData({user, traveler, consumer}) {
    if (user) {
      this._dispatcher.getStore(DataStore).loadFromJSON({json: user});
      this._user_id = user.id;

      if (isNumber(user.unread_conversations_count)) {
        this._dispatcher.getStore(CounterStore).changeCount({
          unread_conversations_count: user.unread_conversations_count,
          unread_notifications_count: user.unread_notifications_count
        });
      }
    }
    if (traveler) {
      this._traveler_id = traveler.id;
      traveler.profile_type = traveler.type === 'stripe_profiles' ? 'stripe' : 'paypal';
      traveler.type = 'traveler_profiles';
      this._dispatcher.getStore(DataStore).loadFromJSON({traveler}, true);
    }
    if (consumer) {
      this._consumer_id = consumer.id;
      this._dispatcher.getStore(DataStore).loadFromJSON({consumer}, true);
    }
    this._successSync();
    this.emitChange();
  }

  _startSync() {
    this._isSyncing = true;
    this._syncedSuccess = false;
  }

  _successSync() {
    this._isSyncing = false;
    this._syncedSuccess = true;
    this._errors = {};
  }

  _failSync(errors) {
    this._isSyncing = false;
    this._syncedSuccess = false;
    this._errors = errors;
  }

  // public methods
  //
  getUser() {
    return this._user_id !== null && this._dispatcher.getStore(UserStore).get(this._user_id);
  }

  getTraveler() {
    return this._traveler_id !== null && this._dispatcher.getStore(TravelerProfileStore).get(this._traveler_id);
  }

  getConsumer() {
    return this._consumer_id !== null && this._dispatcher.getStore(ConsumerProfileStore).get(this._consumer_id);
  }

  isTraveler() {
    return this._traveler_id !== null;
  }

  isAdmin() {
    return this.getUser().isAdmin();
  }

  isBlocked() {
    return this.getUser().isBlocked();
  }

  isGuest() {
    return this.getUser().isGuest();
  }

  isVerified() {
    return !this.getUser().get('verification') || this.getUser().get('verification').confirmed;
  }

  needsSSN() {
    return this.getUser() && this.getUser().needsSSN();
  }

  isSyncing() {
    return this._isSyncing;
  }

  getCreditCard() {
    return this.getConsumer() && this.getConsumer().getCreditCard();
  }

  syncedSuccess() {
    return this._syncedSuccess;
  }

  getErrors() {
    return this._errors;
  }

  isCurrentId(id) {
    return this.getUser() && this.getUser().get('id') === +id;
  }

  isCurrent(user) {
    return user && user.get('id') && this.isCurrentId(user.get('id'));
  }

  dehydrate() {
    return {
      user_id: this._user_id,
      traveler_id: this._traveler_id,
      consumer_id: this._consumer_id
    };
  }

  rehydrate({user_id, traveler_id, consumer_id}) {
    this._user_id = user_id;
    this._traveler_id = traveler_id;
    this._consumer_id = consumer_id;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/stores/AccountStore.js