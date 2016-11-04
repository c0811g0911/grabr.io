import {BaseStore} from 'fluxible/addons';
import {Actions} from '../actions/Constants';
import {LanguageActions} from '../LanguageModel';
import without from 'lodash/without';
import {HttpStatusCode} from '../network/api/HttpStatusCode';

export class AppStore extends BaseStore {

  static storeName = 'AppStore';

  static handlers = {
    [Actions.SET_CONFIG]: 'setConfig',
    [Actions.SET_LANGUAGE]: 'setLanguage',
    [Actions.SET_STATUS_CODE]: 'setStatusCode',

    [LanguageActions.TRANSLATIONS_RECEIVED]: 'translationsReceived',
    [LanguageActions.TRANSLATIONS_REQUESTED]: 'translationsRequested',
    [LanguageActions.TRANSLATIONS_LOADING_FAILED]: 'translationsLoadingFailed',

    [Actions.CALL_HISTORY_METHOD]: 'callHistoryMethod',
    [Actions.CHANGE_LOCATION]: 'changeLocation',
    [Actions.SET_HISTORY]: 'setHistory',

    [Actions.SET_FORM_ERRORS]: 'setFormErrors'
  };

  constructor(dispatcher) {
    super(dispatcher);

    this.history = null;
    this.state = {
      locationBeforeTransitions: null,
      language: null,
      messages: {},
      pendingLanguages: [],
      statusCode: HttpStatusCode.OK,
      formErrors: {}
    };
  }

  setConfig({config}) {
    this.state.config = config;
    this.emitChange();
  }

  setLanguage({language}) {
    this.state.language = language;
    this.emitChange();
  }

  setStatusCode({statusCode}) {
    this.state.statusCode = statusCode;
    this.emitChange();
  }

  translationsReceived({language, messages}) {
    this.state.pendingLanguages = without(this.state.pendingLanguages, language);
    this.state.messages = {
      ...this.state.messages,
      [language]: messages
    };
    this.emitChange();
  }

  getCurrentIntlMessages() {
    return this.state.messages[this.state.language] || {};
  }

  getCurrentLocale() {
    return this.state.language;
  }

  setHistory({history}) {
    this.history = history;
  }

  callHistoryMethod({method, args}) {
    this.history[method](...args);
    this.emitChange();
  }

  changeLocation({location}) {
    this.state.locationBeforeTransitions = location;
    this.emitChange();
  }

  translationsRequested({language}) {
    this.state.pendingLanguages = without(this.state.pendingLanguages, language).concat(language);
    this.emitChange();
  }

  translationsLoadingFailed({language}) {
    this.state.pendingLanguages = without(this.state.pendingLanguages, language);
    this.emitChange();
  }

  setFormErrors({formName, errors}) {
    this.state.formErrors[formName] = errors;
    this.emitChange();
  }

  getFormErrors({formName}) {
    return this.state.formErrors[formName];
  }

  getState() {
    return this.state;
  }

  getTranslation(translations) {
    return translations[this.getState().language];
  }

  dehydrate() {
    return {
      state: this.getState()
    };
  }

  rehydrate({state}) {
    this.state = state;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/stores/AppStore.js