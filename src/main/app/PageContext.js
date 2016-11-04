import React from 'react';
import {IntlProvider} from 'react-intl';
import {AppStore} from './stores/AppStore';
import {provideContext} from 'fluxible-addons-react';

const {func} = React.PropTypes;

export const PageContext = provideContext(class extends React.Component {
  static contextTypes = {
    getStore: func.isRequired
  };

  render() {
    const {children} = this.props;
    const {language, messages} = this.context.getStore(AppStore).getState();
    if (language in messages) {
      return (
        <IntlProvider locale={language} messages={messages[language]}>
          {children}
        </IntlProvider>
      );
    }
    throw new Error('failed to load language or messages');
  }
}, {
  getComponentContext: func,
  getSerializedState: func
});



// WEBPACK FOOTER //
// ./src/main/app/PageContext.js