import URI from 'urijs';

/*
 size options
 tiny (80, nil)
 small (200, nil)
 medium (300, nil)
 large (1000, nil)
 huge (1500, nil)
 */

export function getImageUrl(url, options) {
  if (url) {
    const uri = new URI(url);
    const size = options.size;
    uri.addSearch('size', size);
    return uri.href();
  }
}

export function getImageSize(url) {
  if (url) {
    const uri = new URI(url);
    const ratio = Number(URI.parseQuery(uri.query()).ratio);
    if (isFinite(ratio)) {
      return {
        height: 600,
        width: Math.floor(600 * ratio)
      };
    }
  }
}


// WEBPACK FOOTER //
// ./src/main/app/utils/ImageUtils.js