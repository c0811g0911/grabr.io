let mixpanel;

export async function initMixpanel(mixpanelToken) {
  if (!CLIENT) {
    throw new Error('"Mixpanel" is enabled for browsers only.');
  } else {
    mixpanel = require('mixpanel-browser');
    if (!mixpanelToken) {
      throw new Error('"Mixpanel" token is not set.');
    }
    mixpanel.init(mixpanelToken);
    return mixpanel;
  }
}

export function getMixpanel() {
  if (!mixpanel) {
    throw new Error('"Mixpanel" token is not set.');
  }

  return mixpanel;
}

export async function getMixpanelUTM() {
  try {
    const mixpanel = getMixpanel();
    return {
      'utm_source': mixpanel.get_property('utm_source [first touch]'),
      'utm_medium': mixpanel.get_property('utm_medium [first touch]'),
      'utm_campaign': mixpanel.get_property('utm_campaign [first touch]'),
      'utm_content': mixpanel.get_property('utm_content [first touch]'),
      'utm_term': mixpanel.get_property('utm_term [first touch]')
    };
  } catch (error) {
    logger.warn('src/main/3rd-party/mixpanel', error);
  }
}
Object.defineProperties(getMixpanelUTM, {
  defaults: {
    configurable: false,
    get() {
      return {
        'utm_source': undefined,
        'utm_medium': undefined,
        'utm_campaign': undefined,
        'utm_content': undefined,
        'utm_term': undefined
      };
    }
  }
});

export function getMixpanelClickPage() {
  const path = window.location.pathname.replace(/^\/(en|ru)\/?/, '/');
  switch (true) {
    case /^\/?$/.test(path):
      return 'Landing';
    case /^\/shop\b/.test(path):
      return 'Shop';
    case /^\/travel\b/.test(path):
      return 'Travel';
    case /^\/settings\b/.test(path):
      return 'Profile';
    case /^\/grabs\/\d+\/?$/.test(path):
      return 'Grab';
    case /^\/items\/\d+\/?$/.test(path):
      return 'Item';
  }
}



// WEBPACK FOOTER //
// ./src/main/3rd-party/mixpanel/MixpanelGetters.js