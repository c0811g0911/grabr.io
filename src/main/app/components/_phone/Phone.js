import React, {PropTypes} from 'react';
import {Link} from 'react-router/es6';
import {pushHistoryState} from '../../actions/HistoryActionCreators';
import {Validator} from '../../utils/Validator';
import {PhoneInput} from '../_phone-input/PhoneInput';
import {SyncButton} from '../_sync-button/SyncButton';
import {renderFields} from '../../renderers/renderFields';
import {connectToStores} from 'fluxible-addons-react';
import {updatePhone, confirmPhone, resendSms} from '../../actions/ProfileActionCreators';
import {closeModal} from '../../actions/ModalActionCreators';
import {extend, merge} from 'lodash';
import {AllCountriesStore} from '../../stores/SequenceStores';
import {AccountStore} from '../../stores/AccountStore';
import {FormattedMessage} from 'react-intl';

const phoneSchema = {
  number: ['required']
};

const phoneFormSchema = {
  number: {
    input: PhoneInput,
    inputProps: {
      type: 'tel',
      autoCorrect: 'off',
      autoComplete: 'off'
    }
  }
};

const smsSchema = {
  code: ['required']
};

const smsFormSchema = {
  code: {
    labelText: 'Code',
    inputProps: {
      autoCorrect: 'off',
      noValidate: true
    }
  }
};

class Copy extends React.Component {
  static displayName = 'Copy';

  render() {
    return <p>
      <If condition={this.props.copy}>
        <FormattedMessage id={`forms.phone.copy.${ this.props.copy }`}/>
      </If>
      {" "}
      <FormattedMessage id="forms.phone.copy.rest"/>
    </p>;
  }
}

class PhoneView extends React.Component {
  static displayName = 'PhoneView';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired
  };

  handleEditClick(e) {
    e.preventDefault();
    this.props.onEditClick();
  }

  handleCancelClick(e) {
    e.preventDefault();
    this.context.executeAction(closeModal);
  }

  // Renderers
  //
  renderVerificationInfo() {
    if (this.props.user.isPhoneConfirmed()) {
      return <p className="grabr-correct">
        <FormattedMessage id="forms.phone.verified"/>
      </p>;
    } else {
      return <p className="grabr-incorrect">
        <FormattedMessage id="forms.phone.unverified"/>
      </p>;
    }
  }

  renderCancelButton() {
    if (this.props.isModal) {
      return <button className="transparent" type="button" onClick={this.handleCancelClick.bind(this)}>
        <FormattedMessage id="shared.cancel"/>
      </button>;
    } else {
      return <Link to="/settings" className="flex-self-center transparent link-unstyled">
        <FormattedMessage id="shared.cancel"/>
      </Link>;
    }
  }

  render() {
    return <div>
      <form className="grabr-form">
        <Copy copy={this.props.copy}/>
        <p className="phone-number">
          {(this.props.user.get('phone') || {}).number}
        </p>
        {this.renderVerificationInfo()}
        <section className="flex-row flex-justify-center controls">
          <button className="grabr-button" onClick={this.handleEditClick.bind(this)}>
            {this.props.copy ? <FormattedMessage id="shared.continue"/> :
             <FormattedMessage id="forms.phone.change_number"/>}
          </button>
          {this.renderCancelButton()}
        </section>
      </form>
    </div>;
  }
}

class PhoneForm extends React.Component {
  static displayName = 'PhoneForm';

  static contextTypes = {
    getStore: PropTypes.func.isRequired,
    executeAction: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      attributes: {
        number: (props.phone.number || '').replace('+', ''),
        code: ''
      },
      errors: props.errors,
      showSms: props.showSms
    };
    this.phoneValidator = new Validator(this, phoneSchema);
    this.smsValidator = new Validator(this, smsSchema);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.isSyncing && !newProps.isSyncing && newProps.syncedSuccess) {
      if (!newProps.phone.confirmed) {
        this.setState({showSms: true, errors: newProps.errors});
      }
    } else {
      this.setState({errors: newProps.errors});
    }
  }

  // Helpers
  //
  resendCode() {
    this.context.executeAction(resendSms);
  }

  updatePhone() {
    if (this.phoneValidator.validateForm()) {
      this.context.executeAction(updatePhone, {
        number: '+' + this.state.attributes.number
      });
    }
  }

  verifyPhone() {
    if (this.smsValidator.validateForm()) {
      this.context.executeAction(confirmPhone, {
        code: this.state.attributes.code
      });
    }
  }

  // Handlers
  //
  handleResend(event) {
    event.preventDefault();

    if ('+' + this.state.attributes.number !== this.props.phone.number) {
      this.updatePhone();
    } else {
      this.resendCode();
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.props.phone.number || this.props.user.isPhoneConfirmed()) {
      this.updatePhone();
    } else {
      this.verifyPhone();
    }
  }

  handleCancel(e) {
    if (this.state.showSms) {
      if (this.props.offerId) {
        this.context.executeAction(closeModal);
      } else {
        this.context.executeAction(pushHistoryState, ['/settings']);
      }
    } else {
      this.props.onCancel();
    }
  }

  render() {
    return <div>
      <form className="grabr-form grabr-form-phone" onSubmit={this.handleSubmit.bind(this)}>
        <Copy copy={this.props.copy}/>
        <fieldset>
          {renderFields('phone', phoneFormSchema, {
            component: this,
            validator: this.phoneValidator
          })}
        </fieldset>
        {this.state.showSms && <p>
          <FormattedMessage id="forms.phone.code_sent" values={{number: this.props.phone.number}}/>
        </p>}
        {this.state.showSms && <fieldset>
          {renderFields('phone', smsFormSchema, {
            component: this,
            validator: this.smsValidator
          })}
        </fieldset>}
        {this.state.showSms && <p>
          <SyncButton isSyncing={this.props.isSyncing}
                      className="outlined"
                      type="button"
                      onClick={this.handleResend.bind(this)}>
            <FormattedMessage id="forms.phone.resend"/>
          </SyncButton>
        </p>}
        <section className="flex-row flex-justify-center controls">
          <SyncButton isSyncing={this.props.isSyncing} type="submit">
            {this.state.showSms ? <FormattedMessage id="forms.phone.verify"/> :
             <FormattedMessage id="forms.phone.verify_submit"/>}
          </SyncButton>
          <button type="button" className="transparent" onClick={this.handleCancel.bind(this)}>
            <FormattedMessage id="shared.cancel"/>
          </button>
        </section>
      </form>
    </div>;
  }
}

PhoneForm = connectToStores(PhoneForm, [AllCountriesStore, AccountStore], ({getStore}) => {
  return {
    countries: getStore(AllCountriesStore).get(),
    errors: getStore(AccountStore).getErrors(),
    isSyncing: getStore(AccountStore).isSyncing(),
    syncedSuccess: getStore(AccountStore).syncedSuccess()
  };
});

export const Phone = connectToStores(class extends React.Component {
  static displayName = 'Phone';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      mode: props.user.isPhoneConfirmed() ? 'view' : 'edit'
    };
  }

  switchToEdit() {
    this.setState({mode: 'edit'});
  }

  onFormCancel() {
    const {user} = this.props;

    if (user.get('phone')) {
      this.setState({mode: 'view'});
    } else {
      this.context.executeAction(pushHistoryState, ['/settings']);
    }
  }

  render() {
    switch (this.state.mode) {
      case 'view':
        return <PhoneView phone={this.props.phone}
                          user={this.props.user}
                          copy={this.props.copy}
                          isModal={this.props.offerId}
                          onEditClick={this.switchToEdit.bind(this)}/>;
      case 'edit':
        return <PhoneForm phone={this.props.phone}
                          user={this.props.user}
                          copy={this.props.copy}
                          offerId={this.props.offerId}
                          grabId={this.props.grabId}
                          showSms={this.props.phone.number && !this.props.user.isPhoneConfirmed()}
                          onCancel={this.onFormCancel.bind(this)}/>;
    }
  }

}, [AccountStore], ({getStore}) => {
  const account = getStore(AccountStore);
  return {
    phone: account.getUser().getPhone() || {},
    user: account.getUser(),
    isSyncing: account.isSyncing(),
    syncedSuccess: account.syncedSuccess()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_phone/Phone.js