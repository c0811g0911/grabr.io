import {Actions} from './Constants';
import {fetchTranslations, createLanguageBasedPath} from '../LanguageModel';
import {AppStore} from '../stores/AppStore';
import {LocalStore} from '../stores/LocalStore';
import {makeAuthorizedRequest} from '../utils/ActionUtils';
import {mixpanelTrackLoggedOut} from '../../3rd-party/mixpanel/MixpanelEvents';
import {unregisterMixpanel} from '../../3rd-party/mixpanel/MixpanelRegistration';
import {pushHistoryState} from './HistoryActionCreators';

export function loadCookies(context, {cookies}) {
  return context.dispatch(Actions.LOAD_COOKIES, cookies);
}

export function setStatusCode(context, {statusCode}) {
  context.dispatch(Actions.SET_STATUS_CODE, {statusCode});
}

export async function setLanguage(context, {language}) {
  const {language: activeLanguage, messages, pendingLanguages} = context.getStore(AppStore).getState();

  if (activeLanguage == language || pendingLanguages.includes(language)) {
    // Nothing to do - language did not change or we are loading it already.
    return;
  }
  if (!messages[language]) {
    await fetchTranslations(context, {language});
  }

  context.dispatch(Actions.SET_LANGUAGE, {language});

  if (CLIENT) {
    context.executeAction(pushHistoryState, [createLanguageBasedPath(language, window.location)]);
  }
}

export function setConfig(context, {config}) {
  context.dispatch(Actions.SET_CONFIG, {config});
}

export async function loadCurrentUser(context, {response}) {
  const endpoint = '/account';
  const options = {version: 2};
  const authToken = context.getStore(LocalStore).get('AUTH_TOKEN');

  if (!authToken) {
    return undefined;
  }
  try {
    const {body: {account}} = await makeAuthorizedRequest('get', endpoint, options, context);
    return context.dispatch(Actions.LOAD_ACCOUNT_SUCCESS, account);
  } catch (error) {
    if (response) {
      // FIXME don't do this at home, kids!
      return response.clearCookie('AUTH_TOKEN');
    } else {
      return context.executeAction(signOut);
    }
  }
}

export async function signOut(context, {}) {
  context.dispatch(Actions.SIGN_OUT);
  try {
    await mixpanelTrackLoggedOut();
    await unregisterMixpanel();
  } finally {
    location.href = '/';
  }
}

export function setFormErrors(context, {formName, errors}) {
  context.dispatch(Actions.SET_FORM_ERRORS, {formName, errors});
}



// WEBPACK FOOTER //
// ./src/main/app/actions/AppActionCreators.js