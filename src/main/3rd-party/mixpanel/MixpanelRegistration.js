import {initMixpanel, getMixpanel} from './MixpanelGetters';
import URI from 'urijs';

export async function registerMixpanel(mixpanelToken, account, lang, isNew = false) {
  try {
    const mixpanel = await initMixpanel(mixpanelToken);
    const user = account.getUser();
    {
      const {firstTouch, lastTouch} = parseUtmTags(document.location.href);
      mixpanel.register({
        platform: 'web',
        lang,
        ...lastTouch
      });
      mixpanel.register_once(firstTouch);
      mixpanel.people.set({
        'Platform [last login]': 'web',
        'Language [last login]': navigator.language.slice(0, 2),
        ...lastTouch
      });
      mixpanel.people.set_once({
        'Source path [first touch]': document.location.pathname,
        'Source date [first touch]': new Date().toISOString(),
        'Referrer [first touch]': document.referrer,
        'Referring domain [first touch]': new URI(document.referrer).domain(),
        'Referrer site name [first touch]': parseSource(document.referrer),
        ...firstTouch
      });
    }

    if (!user.isGuest()) {
      const id = `${ user.get('id') }`;
      if (isNew) {
        mixpanel.alias(id);
      }
      mixpanel.identify(id);
      mixpanel.people.union('Platforms', 'web');
    }
  } catch (error) {
    logger.warn('src/main/3rd-party/mixpanel', error);
  }

  /**
   * Parse last touch UTM tags.
   * @see {@link https://blog.mixpanel.com/2015/05/11/community-tip-last-touch-utm-tags/}
   * */
  function parseUtmTags(url) {
    const firstTouch = {};
    const lastTouch = {};
    const query = URI.parseQuery(new URI(url).query());
    for (const param of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      const value = query[param];
      if (value) {
        firstTouch[`${ param } [first touch]`] = value;
        lastTouch[`${ param } [last touch]`] = value;
      }
    }
    return {firstTouch, lastTouch};
  }

  /**
   * Parse custom sources.
   * @see {@link https://mixpanel.com/help/questions/articles/how-do-i-track-sources-of-web-traffic}
   * */
  function parseSource(referrer) {
    if (referrer.search('https?://(.*)google.([^/?]*)') === 0) {
      return 'Google';
    } else if (referrer.search('https?://(.*)bing.([^/?]*)') === 0) {
      return 'Bing';
    } else if (referrer.search('https?://(.*)yahoo.([^/?]*)') === 0) {
      return 'Yahoo';
    } else if (referrer.search('https?://(.*)(facebook|fbcdn).([^/?]*)') === 0) {
      return 'Facebook';
    } else if (referrer.search('https?://(.*)twitter.([^/?]*)') === 0) {
      return 'Twitter';
    } else if (referrer.search('https?://(.*)ya(ndex)?.([^/?]*)') === 0) {
      return 'Yandex';
    } else if (referrer.search('https?://(.*)instagram.([^/?]*)') === 0) {
      return 'Instagram';
    } else if (referrer.search('https?://(.*)techcrunch.([^/?]*)') === 0) {
      return 'Techcrunch';
    } else if (referrer.search('https?://(.*)vk.([^/?]*)') === 0) {
      return 'Vk';
    } else if (referrer.search('https?://(.*)youtube.([^/?]*)') === 0) {
      return 'Youtube';
    } else if (referrer.search('https?://(.*)reddit.([^/?]*)') === 0) {
      return 'Reddit';
    } else if (referrer.search('https?://(.*)pinterest.([^/?]*)') === 0) {
      return 'Pinterest';
    } else {
      return 'Other';
    }
  }
}

export async function unregisterMixpanel() {
  try {
    const mixpanel = await getMixpanel();
    mixpanel.reset();
  } catch (error) {
    logger.warn('src/main/3rd-party/mixpanel', error);
  }
}



// WEBPACK FOOTER //
// ./src/main/3rd-party/mixpanel/MixpanelRegistration.js