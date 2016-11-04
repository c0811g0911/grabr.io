import '!!file?name=[name].[ext]!./favicon.ico';
import '!!file?name=[name].[ext]!./robots.txt';
import 'urijs/src/URITemplate';
import 'core-js/client/shim';
import 'intl';
import React from 'react';
import ReactDOM from 'react-dom';
import throttle from 'lodash/throttle';
import {browserHistory, RouterContext} from 'react-router/es6';
import {matchRoute} from './matchRoute';
import {toPath} from './toPath';
import {HttpStatusCode} from './app/network/api/HttpStatusCode';
import {PageContext} from './app/PageContext';
import {REACT_ROOT_ID} from './app/Page';
import {setStatusCode} from './app/actions/AppActionCreators';
import {getLanguageFromPath, createLanguageBasedPath, getPathWithoutLanguage} from './app/LanguageModel';
import {createRoutes} from './app/createRoutes';
import {Logger} from './logger/Logger';
import {writeToConsole} from './logger/writeToConsole';
import {app} from './app/app';
import {AppStore} from './app/stores/AppStore';
import {replaceHistoryState} from './app/actions/HistoryActionCreators';
import {syncHistoryWithStore} from './app/utils/syncHistoryWithStore';
import {LOG_FIELD} from './createLogScript';
import {INITIAL_STATE_FIELD} from './createInitialStateScript';
import {startPolling as startMessagesPolling} from './app/actions/MessageActionCreators';
import {startPolling as startNotificationsPolling} from './app/actions/NotificationActionCreators';
import {googleAnalyticsPageView} from './3rd-party/google/GoogleAnalyticsEvents';
import {siftSciencePageView, siftScienceGuestPageView} from './3rd-party/siftscience/SiftScienceEvents';
import {LocalStore} from './app/stores/LocalStore';
import {AccountStore} from './app/stores/AccountStore';
import {intercomBoot} from './app/utils/IntercomUtils';
import {registerMixpanel} from './3rd-party/mixpanel/MixpanelRegistration';

// Default logged echos messages to console.
window.logger = new Logger().channel(writeToConsole);

if (LOG_FIELD in window) {
  // Echo messages from server to the client console only.
  for (const payload of window[LOG_FIELD]) {
    writeToConsole(payload);
  }
}

if (INITIAL_STATE_FIELD in window) {
  const dehydratedState = window[INITIAL_STATE_FIELD];
  app.rehydrate(dehydratedState, (error, context) => {
    if (error) {
      logger.warn(error);
      throw error;
    }

    const {language, config: {intercomId, mixpanelToken}} = context.getStore(AppStore).getState();
    const account = context.getStore(AccountStore);

    registerMixpanel(mixpanelToken, account, language);
    intercomBoot(intercomId, account, window.location.href);

    // Start polling for messages/notifications
    context.executeAction(startMessagesPolling);
    context.executeAction(startNotificationsPolling);

    // State may be absent when server rendering failed on rendering or error page.
    startClient(context);
  });
}

function startClient(context) {
  // Singleton store that is propagated through the application using component context.
  const componentContext = context.getComponentContext();

  // Save location to store on change.
  const history = syncHistoryWithStore(browserHistory, context);

  // On every action dispatched in store, application is re-rendered.
  // To prevent re-rendering on consequently dispatched actions throttle is used.
  history.listen(throttle(renderPage, 50));

  async function renderPage() {
    try {
      const path = toPath(window.location);
      const routes = createRoutes(context);
      const {redirectLocation, routingProps} = await matchRoute({location: path, routes, history});

      // Redirect 301
      // -------------
      if (redirectLocation) {
        const redirectPath = toPath(redirectLocation);
        logger.debug('Redirect to ' + redirectPath);

        context.executeAction(replaceHistoryState, [redirectPath]);
        return;
      }

      // OK 200
      // -------------
      if (routingProps) {
        ReactDOM.render(<PageContext context={componentContext}>
          <RouterContext {...routingProps} />
        </PageContext>, document.getElementById(REACT_ROOT_ID));
        return;
      }

      // When URL does not start with language, we need to test weather
      // language-prefixed alternative can be routed to an actual page.
      if (!getLanguageFromPath(path)) {
        const {language} = context.getStore(AppStore).getState();
        const languageBasedPath = createLanguageBasedPath(language, path);
        const {redirectLocation, routingProps} = await matchRoute({location: languageBasedPath, routes, history});

        if (redirectLocation || routingProps) {
          logger.debug('Redirect to language-based path ' + languageBasedPath);

          // Redirect 301
          // -------------
          context.executeAction(replaceHistoryState, [languageBasedPath]);
          return;
        }
      }

      // Error 404
      // -------------
      context.executeAction(setStatusCode, {statusCode: HttpStatusCode.NOT_FOUND});
    } catch (error) {
      logger.error(error);

      // Error 501
      // -------------
      context.executeAction(setStatusCode, {statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR});
    }
  }

  renderPage();
}



// WEBPACK FOOTER //
// ./src/main/client.js