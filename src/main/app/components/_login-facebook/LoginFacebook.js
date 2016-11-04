import React, {PropTypes} from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {SyncButton} from '../_sync-button/SyncButton';
import {loginFacebook} from '../../actions/LoginActionCreators';
import {AccountStore} from '../../stores/AccountStore';
import {FormattedMessage} from 'react-intl';

export const LoginFacebook = connectToStores(class extends React.Component {
  static displayName = 'LoginFacebook';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired
  };

  handleLoginClick() {
    this.context.executeAction(loginFacebook);
  }

  render() {
    return (
      <SyncButton className="facebook" isSyncing={this.props.isSyncing} onClick={this.handleLoginClick.bind(this)}>
        <FormattedMessage id="components.login.labels.facebook"/>
      </SyncButton>
    );
  }
}, [AccountStore], ({getStore}) => {
  return {
    isSyncing: getStore(AccountStore).isSyncing()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_login-facebook/LoginFacebook.js