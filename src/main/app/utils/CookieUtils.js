import cookie from 'cookie';

export function writeCookie(name, value, days, externalOptions) {
  var options = {...externalOptions, path: '/'};

  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    options.expires = date;
  }

  document.cookie = cookie.serialize(name, value, options);
  return document.cookie;
}

export function readCookie(name) {
  return cookie.parse(document.cookie)[name];
}

export function removeCookie(name) {
  document.cookie = cookie.serialize(name, '', {path: '/', expires: new Date(0)});
  return document.cookie;
}



// WEBPACK FOOTER //
// ./src/main/app/utils/CookieUtils.js