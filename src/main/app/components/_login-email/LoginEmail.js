import React, {PropTypes} from 'react';
import {Validator} from '../../utils/Validator';
import {createLoginRenderer} from '../../renderers/login';
import {SyncButton} from '../_sync-button/SyncButton';
import {connectToStores} from 'fluxible-addons-react';
import {loginEmail, sendPasswordResetEmail} from '../../actions/LoginActionCreators';
import {FormattedMessage} from 'react-intl';
import {AccountStore} from '../../stores/AccountStore';
import {AppStore} from '../../stores/AppStore';

export const LoginEmail = connectToStores(class extends React.Component {
  static displayName = 'LoginEmail';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    mode: 'LOGIN'
  };

  constructor(props) {
    super(props);

    this.state = {
      attributes: {
        email: '',
        password: ''
      },
      errors: {},
      email: '',
      mode: props.mode
    };

    this.validator = new Validator(this);
    this.renderForm = createLoginRenderer({
      component: this,
      validator: this.validator
    });
  }

  componentWillReceiveProps(props) {
    this.setState({errors: props.errors});
  }

  // Handlers
  //
  handleSwitch() {
    this.setState({
      mode: this.state.mode === 'LOGIN' ? 'PASSWORD' : 'LOGIN'
    });
    this.props.onModeChange();
  }

  handleInputChange(event) {
    this.setState({email: event.target.value});
  }

  handleLoginSubmit(event) {
    event.preventDefault();

    if (this.validator.validateForm()) {
      this.context.executeAction(loginEmail, this.state.attributes);
    }
  }

  handlePasswordSubmit(event) {
    event.preventDefault();

    this.context.executeAction(sendPasswordResetEmail, {
      email: this.state.email
    });
  }

  render() {
    if (this.state.mode === 'PASSWORD') {
      return <form className="grabr-form" onSubmit={this.handlePasswordSubmit.bind(this)}>
        <fieldset className="grabr-input">
          <input value={this.state.email}
                 onChange={this.handleInputChange.bind(this)}
                 placeholder={this.context.intl.formatMessage({id: 'components.login.forgot_password.email_placeholder'})}
                 autoCapitalize="off"
                 autoCorrect="off"
                 autoComplete="email"
                 type="email"/>
        </fieldset>
        <section className="controls">
          <SyncButton isSyncing={this.props.isSyncing} className="grabr-button" type="submit">
            <FormattedMessage id="shared.submit"/>
          </SyncButton>
        </section>
        <section className="controls">
          <button onClick={this.handleSwitch.bind(this)} className="link" type="button">
            <FormattedMessage id="shared.cancel"/>
          </button>
        </section>
      </form>;
    } else {
      return <form className="grabr-form" onSubmit={this.handleLoginSubmit.bind(this)}>
        <fieldset>
          {this.renderForm()}
        </fieldset>
        <section className="controls">
          <SyncButton isSyncing={this.props.isSyncing} className="grabr-button" type="submit">
            <FormattedMessage id="components.login.labels.login"/>
          </SyncButton>
        </section>
        <section className="controls">
          <button className="link" onClick={this.handleSwitch.bind(this)} type="button">
            <FormattedMessage id="components.login.labels.forgot_password"/>
          </button>
        </section>
      </form>;
    }
  }
}, [AccountStore], ({getStore}) => {
  const account = getStore(AccountStore);
  return {
    errors: account.getErrors(),
    isSyncing: account.isSyncing()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_login-email/LoginEmail.js