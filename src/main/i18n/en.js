import {addLocaleData} from 'react-intl';
import messages from './en.json';

addLocaleData(require('react-intl/locale-data/en'));

if (CLIENT) {
  require(`intl/locale-data/jsonp/en.js`);
}

export {messages};



// WEBPACK FOOTER //
// ./src/main/i18n/en.js