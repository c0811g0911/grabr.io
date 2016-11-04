import React, {PropTypes} from 'react';
import {SyncButton} from '../_sync-button/SyncButton';
import {range} from 'lodash';
import {CardLogo} from '../_card-logo/CardLogo';
import {CountrySelect} from '../_country-select/CountrySelect';
import {facebookPixelTrackAddPaymentInfo} from '../../../3rd-party/facebook/FacebookPixelEvents';
import {Validator} from '../../utils/Validator';
import {connectToStores} from 'fluxible-addons-react';
import {updateCard} from '../../actions/PaymentActionCreators';
import {AccountStore} from '../../stores/AccountStore';
import {AppStore} from '../../stores/AppStore';
import {CountryStore} from '../../stores/DataStores';
import {FormattedMessage} from 'react-intl';

const schema = {
  number: ['required', 'stripe_card_number'],
  expiry_month: ['required'],
  expiry_year: ['required'],
  cvc: ['required', 'stripe_cvc'],
  address_country: ['required'],
  address_zip: attributes => attributes.needsZipcode ? ['required'] : []
};

export const PaymentForm = connectToStores(class extends React.Component {
  static displayName = 'PaymentForm';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      attributes: {},
      errors: {}
    };
    this.validator = new Validator(this, schema);
  }

  componentWillReceiveProps(props) {
    this.setState({errors: props.errors});
  }

  // Handlers
  //
  changeAttribute(name, value) {
    let newState = {};
    if (name === 'address_country') {
      const country = this.context.getStore(CountryStore).get(value);
      const needsZipcode = (country.get('billing_address') || []).indexOf('zipcode') > -1;

      newState = {needsZipcode};
    }
    this.setState({attributes: Object.assign({}, this.state.attributes, newState, {[name]: value})});
  }

  handleInputChange(name, event) {
    this.changeAttribute(name, event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();

    const {attributes} = this.state;
    const {onSuccess} = this.props;

    if (this.validator.validateForm()) {
      facebookPixelTrackAddPaymentInfo();
      this.context.executeAction(updateCard, {
        attributes,
        onSuccess: onSuccess || null
      });
    }
  }

  getCVCLength() {
    const {attributes: {number}} = this.state;

    return number && Stripe && Stripe.card.cardType(number) === 'American Express' ? 4 : 3;
  }

  // fixme: KILL IT WITH FIRE!!!
  renderStipeError() {
    if (!this.state.errors.stripe) {
      return null;
    }

    return <label className="grabr-input">
      <div className="grabr-error">
        <FormattedMessage id={`forms.payment.fields.stripe.errors.${ this.state.errors.stripe[0] }` ||
                              this.state.errors.stripe}/>
      </div>
    </label>;
  }

  renderError(key) {
    if (!this.validator.hasError(this.state.errors, key)) {
      return null;
    }

    return <div className="grabr-error">
      <FormattedMessage id={`forms.payment.fields.${ key }.errors.${ this.state.errors[key][0] }`}/>
    </div>;
  }

  render() {
    return <div className="max-w-100">
      <form className="grabr-form" onSubmit={this.handleSubmit.bind(this)}>
        {this.renderStipeError()}

        <label className="grabr-input">
          {this.renderError('number')}
          <div className="card-wrapper">
            <input type="text"
                   onChange={this.handleInputChange.bind(this, 'number')}
                   placeholder={this.context.intl.formatMessage({id: 'forms.payment.fields.number.placeholder'})}
                   value={String(this.state.attributes.number || '').replace(/\s+/g, '')
                                                                    .replace(/\d{4}(?!$|\s)/g, '$& ')}/>
            <CardLogo number={this.state.attributes.number}/>
          </div>
        </label>

        <div className="grabr-input">
          {this.renderError('expiry_month')}
          {this.renderError('expiry_year')}
          <div>
              <span className="m-r-1">
                 Expiration Date
              </span>
            <select value={this.state.attributes.expiry_month}
                    onChange={this.handleInputChange.bind(this, 'expiry_month')}
                    className="d-inline-block m-r-1">
              <option value={null}>--</option>
              {range(1, 13).map(month => <option value={month}>{month}</option>)}
            </select>
            <select value={this.state.attributes.expiry_year}
                    onChange={this.handleInputChange.bind(this, 'expiry_year')}
                    className="d-inline-block">
              <option value={null}>--</option>
              {range(new Date().getFullYear(), new Date().getFullYear() + 11)
                .map(year => <option value={year}>{year}</option>)}
            </select>
          </div>
        </div>

        <label className="grabr-input">
          {this.renderError('cvc')}
          <input type="text"
                 maxLength={this.getCVCLength()}
                 onChange={this.handleInputChange.bind(this, 'cvc')}
                 value={this.state.attributes.cvc}
                 placeholder="CVC"/>
        </label>

        <label className="grabr-input">
          {this.renderError('name')}
          <input onChange={this.handleInputChange.bind(this, 'name')}
                 value={this.state.attributes.name}
                 placeholder={this.context.intl.formatMessage({id: 'forms.payment.fields.name.placeholder'})}/>
        </label>

        <label className="grabr-input">
          {this.renderError('address_country')}
          <CountrySelect onChange={this.changeAttribute.bind(this, 'address_country')}
                         value={this.state.attributes.address_country}/>
        </label>

        {this.state.attributes.needsZipcode && <label className="grabr-input">
          {this.renderError('address_zip')}
          <input onChange={this.handleInputChange.bind(this, 'address_zip')}
                 value={this.state.attributes.address_zip}
                 placeholder={this.context.intl.formatMessage({id: 'forms.payment.fields.address_zip.placeholder'})}/>
        </label>}

        <section className="flex-row flex-justify-center controls">
          <SyncButton isSyncing={this.props.isSyncing} type="submit">
            <FormattedMessage id={this.props.copy === 'accept_offer' ? 'forms.payment.pay' : 'forms.payment.change'}/>
          </SyncButton>
          <button type="button" onClick={this.props.onCancel} className="transparent">
            <FormattedMessage id="shared.cancel"/>
          </button>
        </section>
      </form>
    </div>;
  }
}, [AccountStore], ({getStore}) => {
  return {
    isSyncing: getStore(AccountStore).isSyncing(),
    errors: getStore(AccountStore).getErrors()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_payment-form/PaymentForm.js