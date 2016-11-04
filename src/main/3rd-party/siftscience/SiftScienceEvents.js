/**
 * Track sift science pageview.
 * @see {@link https://support.siftscience.com/hc/en-us/articles/208370598?_ga=1.174982946.1802834580.1475829269}
 * */
export function siftSciencePageView(sessionId, userId, spoofed, siftScienceSnippetKey) {
  if (spoofed) {
    logger.debug('src/main/3rd-party/siftscience', '`Sift Science` should not track pageviews of a spoofed user');
  } else if (!siftScienceSnippetKey) {
    logger.debug('src/main/3rd-party/siftscience', '"sift science" snippet key is not set.');
  } else {
    const _sift = window._sift = window._sift || [];
    _sift.push(['_setAccount', siftScienceSnippetKey]);
    _sift.push(['_setUserId', userId]);
    _sift.push(['_setSessionId', sessionId]);
    _sift.push(['_trackPageview']);
  }
}

export function siftScienceGuestPageView(sessionId, siftScienceSnippetKey) {
  return siftSciencePageView(sessionId, '', false, siftScienceSnippetKey);
}



// WEBPACK FOOTER //
// ./src/main/3rd-party/siftscience/SiftScienceEvents.js