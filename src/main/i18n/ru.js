import {addLocaleData} from 'react-intl';
import messages from './ru.json';

addLocaleData(require('react-intl/locale-data/ru'));

if (CLIENT) {
  require(`intl/locale-data/jsonp/ru.js`);
}

export {messages};



// WEBPACK FOOTER //
// ./src/main/i18n/ru.js