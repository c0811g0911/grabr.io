import {PageContext} from './PageContext';
import React from 'react';
import ReactDOM from 'react-dom/server';
import {RouterContext} from 'react-router/es6';
import {ServerContext} from './ServerContext';
import {AppStore} from './stores/AppStore';
import {createFacebookScript} from '../3rd-party/facebook/createFacebookScript';
import {createGoogleTagManagerScript} from '../3rd-party/google/createGoogleTagManagerScript';
import {createHubspotScript} from '../3rd-party/hubspot/createHubspotScript';
import {createInitialStateScript} from '../createInitialStateScript';
import {createLogScript} from '../createLogScript';
import {createGoogleAnalyticsScript} from '../3rd-party/google/createGoogleAnalyticsScript';
import {createSiftScienceScript} from '../3rd-party/siftscience/createSiftScienceScript';
import {createIntercomScript} from '../3rd-party/intercom/createIntercomScript';
import {createFacebookPixelScript} from '../3rd-party/facebook/createFacebookPixelScript';

export const DOCTYPE = '<!DOCTYPE html>';

/**
 * Identifier of element to which page body should be rendered on the client.
 * @type {string}
 */
export const REACT_ROOT_ID = 'react-root';

// Rendered if page has no Body element defined or is Body has no children.
const VOID_BODY = <noscript />;

const {object, element, func} = React.PropTypes;
const {toArray} = React.Children;

/**
 * Head is a container component that is never rendered.
 * Immediate children of all `Head` elements defined in `Page` are put in `head` of HTML document.
 */
export function Head() {
  throw new Error('Page/Head should not be rendered');
}

Body.prototype.propTypes = {
  children: element.isRequired
};

export function Body({children}) {
  if (children) {
    if (React.isValidElement(children)) {
      return children;
    }
    throw new Error('Page/Body should contain a single element child');
  }
  return VOID_BODY;
}

Page.contextTypes = {
  getStore: func,
  getComponentContext: func,
  getSerializedState: func,
  request: object,
  response: object,
  routingProps: object
};

export function Page({children}, {getStore, getComponentContext, getSerializedState, request, response, routingProps}) {
  if (CLIENT) {
    let isTitleSet = false;

    for (const child of toArray(children)) {
      if (child.type == Head) {
        for (const child2 of toArray(child.props.children)) {
          if (child2.type == 'title') {
            document.title = child2.props.children;
            isTitleSet = true;
            break;
          }
        }
        break;
      }
    }

    if (!isTitleSet) {
      document.title = '';
    }
  }

  if (SERVER) {
    if (routingProps) {
      const head = [];
      const {config} = getStore(AppStore).getState();
      const {
        facebookAppId,
        googleTagManagerId,
        hubspotId,
        googleAnalyticsId,
        stripePublishableKey,
        siftScienceSnippetKey,
        intercomId,
        yandexCode,
        iosAppId,
        pinterestToken,
        facebookPixelId,
        apiRoot
      } = config;

      for (const child of toArray(children)) {
        if (child.type == Head) {
          head.push(child.props.children);
        }
      }

      let thirdPartyScripts = '';
      if (facebookAppId) {
        thirdPartyScripts += createFacebookScript(facebookAppId);
      }
      if (facebookPixelId) {
        thirdPartyScripts += createFacebookPixelScript(facebookPixelId);
      }
      if (googleTagManagerId) {
        thirdPartyScripts += createGoogleTagManagerScript(googleTagManagerId);
      }
      if (hubspotId) {
        thirdPartyScripts += createHubspotScript(hubspotId);
      }
      if (googleAnalyticsId) {
        thirdPartyScripts += createGoogleAnalyticsScript(googleAnalyticsId)
      }


      return (
        <html>
          <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>

            <script async type="text/javascript" id="mini-profiler"
                    src={apiRoot + '/mini-profiler-resources/includes.js?v=12b4b45a3c42e6e15503d7a03810ff33'}
                    data-version="12b4b45a3c42e6e15503d7a03810ff33"
                    data-path={apiRoot + '/mini-profiler-resources/'}
                    data-current-id="redo66j4g1077kto8uh3" data-ids="redo66j4g1077kto8uh3" data-position="left"
                    data-trivial="false" data-children="false" data-max-traces="10" data-controls="false"
                    data-authorized="true" data-toggle-shortcut="Alt+P" data-start-hidden="false"
                    data-collapse-results="true"/>

            <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico"/>
            <link rel="stylesheet" type="text/css" href="/client.css"/>
            {head}
            <If condition={yandexCode}>
              <meta name="yandex-verification" content={yandexCode}/>
            </If>
            <If condition={iosAppId}>
              <meta name="apple-itunes-app" content={`app-id=${iosAppId}`}/>
            </If>
            <If condition={pinterestToken}>
              <meta name="p:domain_verify" content={pinterestToken}/>
            </If>
            <If condition={intercomId}>
              <script dangerouslySetInnerHTML={{
                __html: createIntercomScript(intercomId)
              }}/>
            </If>
          </head>
          <body>
          <div className="h-100" id={REACT_ROOT_ID} dangerouslySetInnerHTML={{
            __html: ReactDOM.renderToString(
              <ServerContext request={request} response={response}>
                <PageContext context={getComponentContext()}>
                  <RouterContext {...routingProps} />
                </PageContext>
            </ServerContext>)
          }}/>
          <script dangerouslySetInnerHTML={{
            __html: createInitialStateScript(getSerializedState()) + createLogScript(response.log)
          }}/>
          <script dangerouslySetInnerHTML={{
            __html: thirdPartyScripts
          }}/>
          <If condition={stripePublishableKey}>
            <script src="https://js.stripe.com/v2/"/>
            <script dangerouslySetInnerHTML={{
              __html: `Stripe.setPublishableKey('${stripePublishableKey}')`
            }}/>
          </If>
          <If condition={siftScienceSnippetKey}>
            <script dangerouslySetInnerHTML={{
              __html: createSiftScienceScript()
            }}/>
          </If>
          <script async src="/client.js"/>
          </body>
        </html>
      );
    }
  }


  for (const child of toArray(children)) {
    if (child.type == Body) {
      return child;
    }
  }

  // Body was not defined for page.
  return VOID_BODY;
}



// WEBPACK FOOTER //
// ./src/main/app/Page.js