import {Actions} from '../actions/Constants';
import {readCookie} from '../utils/CookieUtils';
import {handleError} from '../utils/handleError';
import {pushHistoryState} from './HistoryActionCreators';
import {AccountStore} from '../stores/AccountStore';
import {changeState} from '../utils/stateMachines';
import {facebookPixelTrackCompleteRegistration} from '../../3rd-party/facebook/FacebookPixelEvents';
import {
  googleAnalyticsTrackCreationFinished,
  googleAnalyticsTrackLoginFinished
} from '../../3rd-party/google/GoogleAnalyticsEvents';
import {AppStore} from '../stores/AppStore';
import {makeAuthorizedRequest} from '../utils/ActionUtils';
import {registerMixpanel} from '../../3rd-party/mixpanel/MixpanelRegistration';
import {getMixpanelUTM} from '../../3rd-party/mixpanel/MixpanelGetters';
import {mixpanelTrackLoginFinished} from '../../3rd-party/mixpanel/MixpanelEvents';
import {post, patch} from '../utils/APIUtils';
import {startPolling as startMessagesPolling} from './MessageActionCreators';
import {startPolling as startNotificationsPolling} from './NotificationActionCreators';
import URI from 'urijs';
import {loadCurrentUser} from '../actions/AppActionCreators';

async function finishRegistration(context, res, provider) {
  context.dispatch(Actions.SHOW_ALERT, {data: {custom: true, type: 'login_success'}});

  context.dispatch(Actions.LOGIN, {
    authToken: res.body.session.auth_token,
    userIsSimulated: false
  });
  await context.executeAction(loadCurrentUser);

  if (res.body.session) {
    const newUser = res.body.session.new_user;
    const account = context.getStore(AccountStore);
    const {language, config: {mixpanelToken}} = context.getStore(AppStore).getState();
    const user = account.getUser();

    mixpanelTrackLoginFinished(newUser, provider);
    registerMixpanel(mixpanelToken, account, language, newUser);
    if (newUser) {
      facebookPixelTrackCompleteRegistration();
      googleAnalyticsTrackCreationFinished(provider);
    } else {
      googleAnalyticsTrackLoginFinished(provider);
    }

    const openEmail = newUser || !user.get('email').confirmed;

    // FIXME Change referrer cookie logic
    const referrerId = readCookie('referrer_key');
    try {
      if (referrerId) {
        await makeAuthorizedRequest('post', '/coupons', {query: {coupon: {token: referrerId}}, version: 2}, context);
      }
    } catch (error) {
    }

    // A LOT OF MAGIC HERE
    changeState({context, type: 'login_finish', executeCallback: !openEmail});

    // FIXME
    document.body.scrollTop = 0;

    if (openEmail) {
      const copy = newUser
        ? user.get('email').confirmed
                     ? 'new_user_confirmed'
                     : 'new_user_unconfirmed'
        : 'login_unconfirmed';

      setTimeout(() => {
        changeState({context, type: 'email_open', copy, defaultNewsletter: newUser, showContinueButton: true});
      }, 500);
    }

    context.executeAction(startMessagesPolling);
    context.executeAction(startNotificationsPolling);
  }
}

export async function validateLogin(context, {email}) {
  try {
    context.dispatch(Actions.LOAD_ACCOUNT_START);
    const query = {check: {email}};
    const {config: {apiRoot}} = context.getStore(AppStore).getState();
    const options = {version: 2, apiRoot};
    await post('/registration/check', query, options);
    return context.dispatch(Actions.LOAD_ACCOUNT_SUCCESS, {});
  } catch (error) {
    handleError(error, context);
  }
}

export async function signupEmail(context, {email, password, first_name, last_name, image_file_id, utm_codes}) {
  try {
    context.dispatch(Actions.LOAD_ACCOUNT_START);
    const query = {user: {email, password, first_name, last_name, image_file_id, utm_codes}};
    const {config: {apiRoot}, language} = context.getStore(AppStore).getState();
    const options = {version: 2, apiRoot, lang: language};
    const res = await post('/registration', query, options);
    return finishRegistration(context, res, 'email');
  } catch (error) {
    handleError(error, context);
  }
}

export async function loginFacebook(context, {}) {
  const {authResponse, status} = await new Promise(resolve => {
    FB.login(resolve, {scope: 'email,public_profile'});
  });
  if (status === 'connected') {
    let utmCodes;
    try {
      utmCodes = await getMixpanelUTM();
    } catch (error) {
      utmCodes = getMixpanelUTM.defaults;
    }
    context.dispatch(Actions.LOAD_ACCOUNT_START);
    const res = await getFacebookAccessToken(authResponse.accessToken, utmCodes);
    return finishRegistration(context, res, 'facebook');
  }

  async function getFacebookAccessToken(accessToken, utmCodes) {
    const {config: {apiRoot}, language} = context.getStore(AppStore).getState();
    const endpoint = URI.expand('/auth/facebook_access_token/callback{?query*}', {
      query: {
        access_token: accessToken,
        ...utmCodes
      }
    }).href();
    const query = {};
    const options = {version: 2, apiRoot, lang: language};
    return await post(endpoint, query, options);
  }
}

export async function loginEmail(context, {email, password}) {
  try {
    context.dispatch(Actions.LOAD_ACCOUNT_START);
    const {config: {apiRoot}, language} = context.getStore(AppStore).getState();
    const query = {session: {email, password}};
    const options = {version: 2, apiRoot, lang: language};
    const res = await post('/session', query, options);
    return finishRegistration(context, res, 'email');
  } catch (error) {
    handleError(error, context, {
      customHandler: () => {
        context.dispatch(Actions.LOAD_ACCOUNT_FAILURE, {errors: {email: ['unauthorized']}});
      }
    });
  }
}

export async function sendPasswordResetEmail(context, {email}) {
  context.dispatch(Actions.LOAD_ACCOUNT_START);
  const {config: {apiRoot}} = context.getStore(AppStore).getState();

  post('/password', {email}, {apiRoot}).then(() => {
    context.dispatch(Actions.LOAD_ACCOUNT_SUCCESS, {});
    context.dispatch(Actions.SHOW_ALERT, {data: {custom: true, type: 'reset_password_success'}});
    context.executeAction(pushHistoryState, ['/']);
  }).catch(err => {
    handleError(err, context);
  });
}

export async function changePassword(context, {token, password}) {
  context.dispatch(Actions.LOAD_ACCOUNT_START);

  const {config: {apiRoot}} = context.getStore(AppStore).getState();

  patch('/password', {token, user: {password}}, {apiRoot}).then(() => {
    context.dispatch(Actions.LOAD_ACCOUNT_SUCCESS, {});
    context.dispatch(Actions.SHOW_ALERT, {data: {custom: true, type: 'new_password_success'}});
    context.executeAction(pushHistoryState, ['/login']);
  }).catch(err => {
    handleError(err, context);
  });
}

export async function simulateUser(context, payload) {
  const {dispatch} = context;
  const {id} = payload;
  const endpoint = URI.expand('/admin/users{/id}/simulation', {id}).href();
  const options = {version: 2};
  const {body: {session}} = await makeAuthorizedRequest('post', endpoint, options, context);
  dispatch(Actions.LOGIN, {authToken: session.auth_token, userIsSimulated: true});
  location.href = '/';
}



// WEBPACK FOOTER //
// ./src/main/app/actions/LoginActionCreators.js