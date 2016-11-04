import React, {PropTypes} from 'react';
import {PaymentForm} from '../_payment-form/PaymentForm';
import {CardLogo} from '../_card-logo/CardLogo';
import {Link} from 'react-router/es6';
import {connectToStores} from 'fluxible-addons-react';
import {FormattedMessage} from 'react-intl';
import {AccountStore} from '../../stores/AccountStore';
import './_payment.scss';
import {pushHistoryState} from '../../actions/HistoryActionCreators';


export const Payment = connectToStores(class extends React.Component {
  static displayName = 'Payment';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired
  };

  static propTypes = {
    grab: PropTypes.any,
    offer: PropTypes.any
  };

  constructor(props) {
    super(props);

    this.state = {
      mode: 'view'
    };
  }

  // Helpers
  //
  getCreditCard() {
    return this.context.getStore(AccountStore).getCreditCard();
  }

  switchToEdit() {
    this.setState({mode: 'edit'});
  }

  switchToView() {
    this.setState({mode: 'view'});
  }

  // Renderers
  //
  renderChangeCardButton() {
    if (!this.props.grabId) {
      return null;
    }

    return <button onClick={this.switchToEdit.bind(this)} className="grabr-button outlined">
      <FormattedMessage id="components.payment.change_card"/>
    </button>;
  }

  renderCreditCard() {
    if (this.getCreditCard().last4) {
      return <div className="credit-card grabr-input">
        <div>
            <span>
              **** **** **** {this.getCreditCard().last4}
            </span>
          <CardLogo type={this.getCreditCard().brand}/>
          {this.renderChangeCardButton()}
        </div>
      </div>;
    } else {
      return <label className="credit-card grabr-input">
        <button className="grabr-button outlined" onClick={this.switchToEdit.bind(this)}>
          <FormattedMessage id="components.payment.add_card"/>
        </button>
      </label>;
    }
  }

  render() {
    switch (this.state.mode) {
      case 'view':
        return <div className="grabr-form">
          {this.renderCreditCard()}
          <section className="flex-row flex-justify-center controls">
            <button className="grabr-button" onClick={this.switchToEdit.bind(this)}>
              <FormattedMessage id="shared.change"/>
            </button>
            <Link to="/settings" className="flex-self-center transparent link-unstyled">
              <FormattedMessage id="shared.cancel"/>
            </Link>
          </section>
        </div>;
      case 'edit':
        return <PaymentForm onSuccess={() => {
          this.context.executeAction(pushHistoryState, ['/settings']);
        }} onCancel={this.switchToView.bind(this)}/>;
    }
  }
}, [AccountStore], () => {
  return {};
});



// WEBPACK FOOTER //
// ./src/main/app/components/_payment/Payment.js