export function debug(...args) {
  logger.warn('analytics/google-analytics', ...args);
}

async function ga() {
  switch (true) {
    case !window:
      throw '`Google Analytics` is enabled for browsers only';
    case !window.ga:
      throw '`window.ga` does not exist';
    default:
      return window.ga;
  }
}

export async function googleAnalyticsPageView(page) {
  try {
    const ga$ = await ga();
    return new Promise(resolve => {
      ga$('send', {
        hitType: 'pageview',
        hitCallback: resolve,
        page
      });
    });
  } catch (error) {
    debug(error);
  }
}

function event(eventCategory) {
  return async function ({eventAction, eventLabel, eventValue}) {
    try {
      const ga$ = await ga();
      return new Promise(resolve => {
        ga$('send', {
          hitType: 'event',
          hitCallback: resolve,
          eventCategory,
          eventAction,
          eventLabel,
          eventValue
        });
      });
    } catch (error) {
      debug(error);
    }
  };
}

const send = event('user');

export async function googleAnalyticsTrackLoginOpen() {
  return send({
    eventAction: 'login open',
    eventLabel: 'success'
  });
}

export async function googleAnalyticsTrackCreationFinished(provider) {
  return send({
    eventAction: 'creation finished',
    eventLabel: provider
  });
}

export async function googleAnalyticsTrackLoginFinished(provider) {
  return send({
    eventAction: 'login finished',
    eventLabel: provider
  });
}

export async function googleAnalyticsTrackGrabCreationFinished() {
  return send({
    eventAction: 'grab creation finished',
    eventLabel: 'success'
  });
}

export async function googleAnalyticsTrackMakeOfferFinished() {
  return send({
    eventAction: 'make offer finished',
    eventLabel: 'success'
  });
}



// WEBPACK FOOTER //
// ./src/main/3rd-party/google/GoogleAnalyticsEvents.js