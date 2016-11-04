import React, {PropTypes} from 'react';
import {Link} from 'react-router/es6';
import moment from 'moment';
import {Validator} from '../../utils/Validator';
import {becomeTraveler} from '../../actions/TravelerActionCreators';
import {SyncButton} from '../../components/_sync-button/SyncButton';
import {CountrySelect} from '../../components/_country-select/CountrySelect';
import {connectToStores} from 'fluxible-addons-react';
import {createStripeRenderer} from '../../renderers/stripe';
import {createPaypalRenderer} from '../../renderers/paypal';
import {merge} from 'lodash';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import {AccountStore} from '../../stores/AccountStore';
import {CountryStore} from '../../stores/DataStores';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import {AppStore} from '../../stores/AppStore';
import {Alerts} from '../../components/_alerts/Alerts';
import {Modal} from '../../components/_modal/Modal';
import {mixpanelPageViewBecomeTraveler} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {trackPageView} from '../../utils/trackPageView';

const payoutUrls = {};

payoutUrls.stripe = require('./images/stripe.png');
payoutUrls.paypal = require('./images/paypal.png');

const securityUrl = require('./images/security.svg');

export const BecomeTravelerPage = connectToStores(class extends React.Component {
  static displayName = 'BecomeTravelerPage';

  static propTypes = {
    location: PropTypes.shape({
      query: PropTypes.object.isRequired
    }),
    user: PropTypes.object.isRequired
  };

  static contextTypes = {
    getStore: PropTypes.func.isRequired,
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      attributes: {
        first_name: props.user.get('first_name'),
        last_name: props.user.get('last_name'),
        birth_date: props.user.get('birth_date') || moment().format(),
        country: '',
        type: null
      },
      errors: {}
    };
    this.stripeValidator = new Validator(this);
    this.paypalValidator = new Validator(this);
    this.renderStripe = createStripeRenderer({
      component: this,
      validator: this.stripeValidator
    });
    this.renderPaypal = createPaypalRenderer({
      component: this,
      validator: this.paypalValidator
    });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: '/traveler'});
    mixpanelPageViewBecomeTraveler();
  }

  componentWillReceiveProps(newProps) {
    this.setState({errors: newProps.errors});
  }

  // Helpers
  //
  getCopy() {
    return this.props.location.query.copy;
  }

  // Handlers
  //
  handleCountryChange(value) {
    const country = this.context.getStore(CountryStore).get(value);
    const subdivisions = country.get('subdivisions');

    this.setState({
      attributes: Object.assign({}, this.state.attributes, {
        country: value,
        currency: country.get('currencies')[0],
        state: subdivisions.length > 0 ? subdivisions[0].code : null,
        type: country.getPayoutType()
      })
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const validationMethod = this.state.attributes.type === 'paypal'
      ? this.paypalValidator.validateForm.bind(this.paypalValidator)
      : this.stripeValidator.validateForm.bind(this.stripeValidator);

    if (validationMethod()) {
      this.context.executeAction(becomeTraveler, {
        attributes: this.state.attributes
      });
    }
  }

  // Renderers
  //
  renderForm() {
    if (this.state.attributes.type === 'paypal') {
      return this.renderPaypal();
    } else if (this.state.attributes.type === 'stripe') {
      return this.renderStripe();
    } else {
      return this.renderPlaceholder();
    }
  }

  renderPlaceholder() {
    return <div className="grabr-placeholder">
      <FormattedMessage id="pages.become_traveler.select_country.placeholder"/>
    </div>;
  }

  renderPayoutInfo() {
    const {country, type} = this.state.attributes;
    if (!this.state.attributes.type) {
      return null;
    }

    return <fieldset className="payout">
      <img src={payoutUrls[type]}/>
      <h3><FormattedMessage id={`pages.become_traveler.payout_info.${ type }.title`}/></h3>
      <p><FormattedHTMLMessage id={`pages.become_traveler.payout_info.${ type }.text`}/></p>
      <p className="security">
        <img src={securityUrl}/>
        <a href="https://stripe.com/docs/security" target="_blank">
          <FormattedMessage id="pages.become_traveler.payout_info.security"/>
        </a>
      </p>
    </fieldset>;
  }

  render() {
    return (
      <Page>
        <Head>
          <title>
            {this.context.intl.formatMessage({id: 'pages.become_traveler.document_title'})}
          </title>
        </Head>
        <Body>
        <div>
          <NavigationBar/>
          <div className="container-fluid w-100 m-md-b-3 m-md-t-3 m-t-2">
            <h1 className="text-center font-size-xl m-b-2">
              <FormattedMessage id="pages.become_traveler.page_header"/>
            </h1>
            <div className="row">
              <div className="col-xs-12 col-md-8 offset-md-2 col-lg-8 offset-lg-2
                                      panel panel--legacy panel--xs-top-rounded panel--xs-bottom-rounded text-black p-a-0"
              >
                <div className="become-traveler-page">
                  <form className="grabr-form" onSubmit={this.handleSubmit.bind(this)}>
                    <div className="highlighted">
                      <h2><FormattedMessage id="pages.become_traveler.select_country.title"/></h2>
                      <p><FormattedMessage id="pages.become_traveler.select_country.text"/></p>
                      <label className="grabr-input">
                        <CountrySelect traveler
                                       onChange={this.handleCountryChange.bind(this)}
                                       value={this.state.attributes.country}/>
                      </label>
                    </div>
                    {this.renderPayoutInfo()}
                    {this.renderForm()}
                    {this.state.attributes.type && <section className="flex-row flex-justify-center controls">
                      <SyncButton isSyncing={this.props.isSyncing} type="submit">
                        <FormattedMessage id={`shared.${this.getCopy() ? 'continue' : 'become'}`}/>
                      </SyncButton>
                      <Link to="/settings" className="flex-self-center transparent link-unstyled">
                        <FormattedMessage id="shared.cancel"/>
                      </Link>
                    </section>}
                  </form>
                </div>
              </div>
            </div>
          </div>
          <Footer/>
          <Alerts />
          <Modal />
        </div>
        </Body>
      </Page>
    );
  }

}, [AccountStore], ({getStore}) => {
  const account = getStore(AccountStore);
  return {
    user: account.getUser(),
    isSyncing: account.isSyncing(),
    errors: account.getErrors()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/_become-traveler/BecomeTravelerPage.js