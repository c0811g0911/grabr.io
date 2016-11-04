import {googleAnalyticsPageView} from '../../3rd-party/google/GoogleAnalyticsEvents';
import {siftSciencePageView, siftScienceGuestPageView} from '../../3rd-party/siftscience/SiftScienceEvents';
import {LocalStore} from '../stores/LocalStore';
import {AccountStore} from '../stores/AccountStore';
import {AppStore} from '../stores/AppStore';

export function trackPageView(context, {path}) {
  if (SERVER) {
    return;
  }

  googleAnalyticsPageView(path);

  const userIsSimulated = context.getStore(LocalStore).userIsSimulated();
  const isLoggedIn = context.getStore(LocalStore).isLoggedIn();

  if (!userIsSimulated) {
    const userId = context.getStore(AccountStore).getUser().getId();
    const sessionId = context.getStore(LocalStore).getSessionId();
    const {siftScienceSnippetKey} = context.getStore(AppStore).getState().config;

    if (isLoggedIn) {
      siftSciencePageView(sessionId, userId, false, siftScienceSnippetKey);
    } else {
      siftScienceGuestPageView(sessionId, siftScienceSnippetKey);
    }
  }
}



// WEBPACK FOOTER //
// ./src/main/app/utils/trackPageView.js