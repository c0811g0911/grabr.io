import React, {PropTypes} from 'react';
import {Validator} from '../../utils/Validator';
import {SyncButton} from '../_sync-button/SyncButton';
import {changeState} from '../../utils/stateMachines';
import {connectToStores} from 'fluxible-addons-react';
import {updateEmail} from '../../actions/ProfileActionCreators';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import {AccountStore} from '../../stores/AccountStore';
import {resendEmail} from '../../actions/ProfileActionCreators';

const schema = {
  address: ['required', 'email']
};

export const Email = connectToStores(class extends React.Component {
  static displayName = 'Email';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      attributes: {
        address: props.user.get('email').address,
        newsletter: props.defaultNewsletter ? true : props.user.get('email').newsletter
      },
      errors: {}
    };
    this.validator = new Validator(this, schema);
  }

  // Lifecycle methods
  //
  componentWillReceiveProps(props) {
    this.setState({errors: props.errors});
  }

  // Helpers
  //
  changeAttribute(name, {value}) {
    this.setState({
      attributes: {
        ...this.state.attributes,
        [name]: value
      }
    });
  }

  // Handlers
  //
  handleInputChange(name, event) {
    this.changeAttribute(name, {value: event.target.value});
  }

  handleUpdateNewsletter(event) {
    this.changeAttribute('newsletter', {value: event.target.checked});
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.validator.validateForm()) {
      this.context.executeAction(updateEmail, {
        address: this.state.attributes.address,
        newsletter: this.state.attributes.newsletter
      });
    }
  }

  handleCancelClick() {
    changeState({type: 'cancel', context: this.context});
  }

  // Renderers
  //
  renderError(key) {
    if (!this.validator.hasError(this.state.errors, key)) {
      return null;
    }

    return <div className="grabr-error">
      <FormattedMessage id={`forms.email.fields.${ key }.errors.${ this.state.errors[key][0] }`}/>
    </div>;
  }

  renderVerificationInfo() {
    if (this.props.user.isEmailConfirmed()) {
      return <p className="grabr-correct">
        <FormattedMessage id="forms.email.verified"/>
      </p>;
    } else {
      return <p className="grabr-incorrect">
        <FormattedMessage id="forms.email.unverified"/>
      </p>;
    }
  }

  renderNewsletterFlag() {
    if (!this.props.user.get('email')) {
      return null;
    }

    return <label className="grabr-input">
      <input type="checkbox"
             checked={this.state.attributes.newsletter}
             onChange={this.handleUpdateNewsletter.bind(this)}/>
      <FormattedMessage id="forms.email.fields.newsletter.label"/>
    </label>;
  }

  renderResendButton() {
    if (this.props.user.isEmailConfirmed()) {
      return null;
    }

    return <p>
      <SyncButton className="outlined"
                  type="button"
                  isSyncing={this.props.user.isSyncing}
                  onClick={() => this.context.executeAction(resendEmail)}>
        <FormattedMessage id="forms.email.resend"/>
      </SyncButton>
    </p>;
  }

  render() {
    const {showContinueButton} = this.props;

    return <div>
      <form className="grabr-form" onSubmit={this.handleSubmit.bind(this)}>
        <p>
          <If condition={this.props.copy}>
            <FormattedHTMLMessage id={`forms.email.copy.${ this.props.copy }`}/>
          </If>
          {this.props.copy && ' '}
          <FormattedMessage id="forms.email.copy.rest"/>
        </p>
        <fieldset>
          <label className="grabr-input">
            {this.renderError('address')}
            <input type="email"
                   onChange={event => this.handleInputChange('address', event)}
                   value={this.state.attributes.address}
                   autoCapitalize="off"
                   autoCorrect="off"
                   autoComplete="email"
                   placeholder="example@email.com"/>
          </label>
        </fieldset>
        {this.renderVerificationInfo()}
        {this.renderResendButton()}
        {this.renderNewsletterFlag()}
        <section className="flex-row flex-justify-center controls">
          <If condition={!this.props.copy || showContinueButton}>
            <SyncButton isSyncing={this.props.isSyncing} type="submit">
              <FormattedMessage id={`shared.${ this.props.copy ? 'continue' : 'update' }`}/>
            </SyncButton>
          </If>
          <button type="button" onClick={this.handleCancelClick.bind(this)} className="transparent">
            <FormattedMessage id={`shared.${ this.props.copy && !showContinueButton ? 'ok' : 'cancel' }`}/>
          </button>
        </section>
      </form>
    </div>;
  }

}, [AccountStore], ({getStore}) => {
  return {
    user: getStore(AccountStore).getUser(),
    errors: getStore(AccountStore).getErrors(),
    isSyncing: getStore(AccountStore).isSyncing()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_email/Email.js