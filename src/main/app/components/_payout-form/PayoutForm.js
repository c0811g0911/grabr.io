import React, {PropTypes} from 'react';
import moment from 'moment';
import {Validator} from '../../utils/Validator';
import {Link} from 'react-router/es6';
import {SyncButton} from '../_sync-button/SyncButton';
import {connectToStores} from 'fluxible-addons-react';
import {loadCountries} from '../../actions/HelperActionCreators';
import {updateBankAccount} from '../../actions/PaymentActionCreators';
import {createStripeRenderer} from '../../renderers/stripe';
import {createPaypalRenderer} from '../../renderers/paypal';
import _, {merge} from 'lodash';
import {AccountStore} from '../../stores/AccountStore';
import {TravelerCountriesStore} from '../../stores/SequenceStores';
import {CountryStore} from '../../stores/DataStores';
import {FormattedMessage} from 'react-intl';

export const PayoutForm = connectToStores(class extends React.Component {
  static displayName = 'StripeForm';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const {traveler} = props;

    this.type = traveler.get('profile_type');

    const address = traveler.get('address') || {};
    const bankAccount = traveler.get('bank_account') || {};

    const attributes = this.type === 'paypal' ? {
      email: traveler.get('email')
    } : {
      first_name: traveler.get('first_name'),
      last_name: traveler.get('last_name'),
      birth_date: traveler.get('birth_date') || moment().format(),
      street: address.street,
      zip: address.zip,
      city: address.city,
      state: address.state,
      country: address.country_alpha2,
      routing_number: bankAccount.routing_number || ''
    };

    this.state = {
      attributes,
      errors: {}
    };
    this.validator = new Validator(this);
    const renderer = this.type === 'paypal' ? createPaypalRenderer : createStripeRenderer;
    this.renderForm = renderer({
      component: this,
      validator: this.validator
    });
  }

  componentDidMount() {
    this.context.executeAction(loadCountries, {traveler: true});
  }

  componentWillReceiveProps(props) {
    this.setState({errors: props.errors});
  }

  handleSubmit(event) {
    event.preventDefault();

    const country = this.context.getStore(CountryStore).get(this.state.attributes.country);

    if (this.validator.validateForm()) {
      this.context.executeAction(updateBankAccount, {
        attributes: Object.assign({}, this.state.attributes, {
          currency: country ? country.get('currencies')[0] : null
        }),
        type: this.type
      });
    }
  }

  // Renderers
  //
  render() {
    return <div>
      <form className="grabr-form" onSubmit={this.handleSubmit.bind(this)}>
        {this.renderForm()}
        <section className="flex-row flex-justify-center controls">
          <SyncButton isSyncing={this.props.isSyncing} type="submit">
            {this.props.submitLabelCopy || <FormattedMessage id="shared.update"/>}
          </SyncButton>
          <Link to="/settings" className="flex-self-center transparent link-unstyled">
            <FormattedMessage id="shared.cancel"/>
          </Link>
        </section>
      </form>
    </div>;
  }

}, [AccountStore, TravelerCountriesStore], ({getStore}) => {
  const account = getStore(AccountStore);
  return {
    isSyncing: account.isSyncing(),
    traveler: account.getTraveler(),
    errors: account.getErrors()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_payout-form/PayoutForm.js