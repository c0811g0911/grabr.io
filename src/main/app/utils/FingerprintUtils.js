import Fingerprint from 'fingerprintjs2';
import {writeCookie, readCookie} from './CookieUtils';

if (CLIENT) {
  window._fingerprint = readCookie('fingerprint');

  if (!window._fingerprint) {
    new Fingerprint().get(result => {
      writeCookie('fingerprint', result, 365);
      window._fingerprint = result;
    });
  }
}



// WEBPACK FOOTER //
// ./src/main/app/utils/FingerprintUtils.js