import {createLoginRenderer} from '../../renderers/login';
import {createPersonalRenderer} from '../../renderers/personal';
import React from 'react';
import {SyncButton} from '../_sync-button/SyncButton';
import {Validator} from '../../utils/Validator';
import {AccountStore} from '../../stores/AccountStore';
import {connectToStores} from 'fluxible-addons-react';
import {ImageStore} from '../../stores/DataStores';
import {getMixpanelUTM} from '../../../3rd-party/mixpanel/MixpanelGetters';
import {validateLogin, signupEmail} from '../../actions/LoginActionCreators';
import {AppStore} from '../../stores/AppStore';
import {FormattedMessage} from 'react-intl';

const {func} = React.PropTypes;

export const SignupEmail = connectToStores(class extends React.Component {
  static displayName = 'SignupEmail';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      attributes: {
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        avatar: null
      },
      errors: {},
      step: 'EMAIL'
    };

    this.loginValidator = new Validator(this);
    this.personalValidator = new Validator(this);
    this.renderLogin = createLoginRenderer({component: this, validator: this.loginValidator});
  }

  componentDidMount() {
    this.renderPersonal = createPersonalRenderer({
      userId: this.context.getStore(AccountStore).getUser().get('id'),
      component: this,
      validator: this.personalValidator
    });
  }

  componentWillReceiveProps({isSyncing, errors, syncedSuccess, user}) {
    if (this.props.isSyncing && !isSyncing && syncedSuccess) {
      this.setState({step: 'PROFILE'});
      this.props.onModeChange();
    } else {
      this.setState({
        attributes: {
          ...this.state.attributes,
          avatar: user.get('avatar') || null
        },
        errors
      });
    }
  }

  render() {
    const {executeAction} = this.context;
    const {isSyncing} = this.props;
    const {step} = this.state;
    switch (step) {
      case 'PROFILE': {
        return <form className="grabr-form" onSubmit={async function (event) {
          event.preventDefault();
          if (this.personalValidator.validateForm()) {
            const {attributes: {email, password, first_name, last_name, avatar}} = this.state;
            const image_file_id = avatar.get('file_id');
            let utm_codes;
            try {
              utm_codes = await getMixpanelUTM();
            } catch (error) {
              utm_codes = getMixpanelUTM.defaults;
            }
            executeAction(signupEmail, {email, password, first_name, last_name, image_file_id, utm_codes});
          }
        }.bind(this)}>
          <fieldset>
            {this.renderPersonal()}
          </fieldset>
          <section className="controls">
            <SyncButton id={`analytics-${ this.context.getStore(AppStore).getState().language }-update-sign-up`}
                        isSyncing={isSyncing || (this.state.attributes.avatar || {}).isSyncing}
                        type="submit">
              <FormattedMessage id="shared.update"/>
            </SyncButton>
          </section>
        </form>;
      }
      default: {
        return <form className="grabr-form" onSubmit={event => {
          event.preventDefault();
          if (this.loginValidator.validateForm()) {
            const {attributes: {email}} = this.state;
            executeAction(validateLogin, {email});
          }
        }}>
          <fieldset>
            {this.renderLogin()}
          </fieldset>
          <section className="controls">
            <SyncButton id={`analytics-${ this.context.getStore(AppStore).getState().language }-sign-up`}
                        isSyncing={isSyncing}
                        type="submit">
              <FormattedMessage id="components.login.labels.signup_submit"/>
            </SyncButton>
          </section>
        </form>;
      }
    }
  }
}, [AccountStore, ImageStore], ({getStore}) => {
  const account = getStore(AccountStore);
  return {
    user: account.getUser(),
    isSyncing: account.isSyncing(),
    syncedSuccess: account.syncedSuccess(),
    errors: account.getErrors()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_signup-email/SignupEmail.js