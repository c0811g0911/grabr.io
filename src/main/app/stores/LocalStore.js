import {BaseStore} from 'fluxible/addons';
import {Actions} from '../actions/Constants';
import {writeCookie, removeCookie} from '../utils/CookieUtils';
import _ from 'lodash';

export class LocalStore extends BaseStore {

  static storeName = 'LocalStore';

  static handlers = {
    [Actions.LOAD_COOKIES]: 'onLoadCookies',
    [Actions.SET_COOKIE]: 'onSetCookie',
    [Actions.REMOVE_COOKIE]: 'onRemoveCookie',
    [Actions.SET_RECORD]: 'onSetRecord',
    [Actions.LOGIN]: 'onLogin',
    [Actions.SIGN_OUT]: 'onSignOut'
  };

  constructor(dispatcher) {
    super(dispatcher);

    this.records = {};
  }

  onLogin({authToken, userIsSimulated}) {
    this.setCookie('AUTH_TOKEN', authToken);

    this.writeCookie('USER_IS_SIMULATED', userIsSimulated);
    this.emitChange();
  }

  onSignOut() {
    this.removeCookie('AUTH_TOKEN');
    this.removeCookie('USER_IS_SIMULATED');
  }

  onLoadCookies(cookies) {
    _.map(cookies, (value, key) => {
      try {
        this.records[key] = JSON.parse(value);
      } catch (e) {
        this.records[key] = value;
      }
    });
    this.emitChange();
  }

  onSetCookie(data) {
    _.map(data, (value, key) => {
      if (value) {
        this.setCookie(key, value);
      } else {
        this.removeCookie(key, value);
      }
    });
    this.emitChange();
  }

  onSetRecord(data) {
    _.map(data, (value, key) => {
      this.write(key, value);
    });
    this.emitChange();
  }

  removeCookie(key) {
    this.records[key] = null;
    removeCookie(key);
  }

  setCookie(key, value, externalOptions) {
    this.records[key] = value;
    writeCookie(key, JSON.stringify(value), 14, externalOptions);
  }

  onRemoveCookie(keys) {
    keys.forEach(key => {
      this.removeCookie(key);
    });
    this.emitChange();
  }

  writeCookie(key, value, days = null) {
    this.records[key] = value;
    writeCookie(key, JSON.stringify(value), days);
    this.emitChange();
  }

  write(key, value) {
    this.records[key] = value;
    this.emitChange();
  }

  get(key) {
    return this.records[key];
  }

  isLoggedIn() {
    return !!this.records['AUTH_TOKEN'];
  }

  userIsSimulated() {
    return !!this.get('USER_IS_SIMULATED');
  }

  getSessionId() {
    return this.get('SESSION_ID');
  }

  getAuthToken() {
    return this.get('AUTH_TOKEN');
  }

  dehydrate() {
    return {
      records: this.records
    };
  }

  rehydrate({records}) {
    this.records = records;
  }

}



// WEBPACK FOOTER //
// ./src/main/app/stores/LocalStore.js