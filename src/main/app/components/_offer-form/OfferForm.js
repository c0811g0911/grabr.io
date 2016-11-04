import React, {PropTypes} from 'react';
import {makeOffer} from '../../actions/GrabActionCreators';
import {connectToStores} from 'fluxible-addons-react';
import {DateTimeInput} from '../_date-time-input/DateTimeInput';
import {Money} from '../_money/Money';
import {SyncButton} from '../_sync-button/SyncButton';
import {ItemsPrice} from '../_items-price/ItemsPrice';
import {GrabFormFrom} from '../_cities-suggest/CitiesSuggest';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import moment from 'moment';
import {Validator} from '../../utils/Validator';
import {placeToForm} from '../../utils/placeToForm';
import {GrabStore} from '../../stores/DataStores';
import {AccountStore} from '../../stores/AccountStore';
import {AppStore} from '../../stores/AppStore';


const schema = {
  bid_cents: ['required', {max_number: 300000}, {min_number: 500}],
  comment: [{max_length: 140}],
  from: ['required'],
  delivery_date: ['required', 'future', {deadline: 25}]
};

export const OfferForm = connectToStores(class extends React.Component {
  static displayName = 'OfferForm';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const offer = this.getOffer() || null;

    let defaultDeliveryDate;

    if (!props.grab.get('due_date')) {
      defaultDeliveryDate = moment().add(15, 'days');
    } else if (moment(props.grab.get('due_date')) < moment().add(24, 'days')) {
      defaultDeliveryDate = props.grab.get('due_date');
    } else {
      defaultDeliveryDate = moment().add(24, 'days');
    }

    const bid_cents = offer ? offer.get('bid_cents') : props.grab.get('reward_cents');
    const delivery_date = offer ? offer.get('delivery_date') : defaultDeliveryDate;
    const comment = offer ? offer.get('comment') || '' : '';
    const from = offer ? offer.get('from') : props.grab.get('from');

    this.state = {
      attributes: {bid_cents, delivery_date, comment, from},
      errors: {}
    };
    this.validator = new Validator(this, schema);
  }

  componentWillReceiveProps(props) {
    this.setState({errors: props.errors});
  }

  // Helpers
  //
  getOffer() {
    return this.props.grab.getGrabberOffer(this.props.currentUser);
  }

  getTotal() {
    return this.props.grab.getItemPrice() + this.state.attributes.bid_cents;
  }

  changeAttribute(name, {value}) {
    this.setState(Object.assign(this.state.attributes, {[name]: value}));
  }

  // Handlers
  //
  handleInputChange(name, event) {
    this.changeAttribute(name, {value: event.target.value});
  }

  handleValueChange(name, value) {
    this.changeAttribute(name, {value});
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.validator.validateForm()) {
      this.context.executeAction(makeOffer, {
        grabId: this.props.grab.get('id'),
        attributes: this.state.attributes
      });
    }
  }

  handleCancelClick() {
    history.back();
  }

  renderError(key) {
    if (!this.validator.hasError(this.state.errors, key)) {
      return null;
    }

    return <div className="grabr-error">
      <FormattedMessage id={`forms.offer.fields.${ key }.errors.${ this.state.errors[key][0] }`}/>
    </div>;
  }

  render() {
    const {from} = this.state.attributes;

    return <form className="grabr-form" onSubmit={this.handleSubmit.bind(this)}>
      <p><FormattedHTMLMessage id="forms.offer.copy"/></p>
      <h4 className="header-caps">
        <FormattedMessage id="forms.offer.item"/>
      </h4>
      <fieldset>
        <label className="grabr-input not-editable">
          <ItemsPrice grab={this.props.grab}/>
        </label>
        <label className="grabr-input">
          <FormattedMessage id="forms.offer.fields.bid_cents.label"/>
          {this.renderError('bid_cents')}
          <Money asInput={true}
                 error={this.renderError('bid_cents')}
                 onChange={this.handleValueChange.bind(this, 'bid_cents')}
                 value={this.state.attributes.bid_cents}/>
        </label>
        <label className="grabr-input">
          <FormattedMessage id="forms.offer.fields.from.label"/>
          {this.renderError('from')}
          <GrabFormFrom onChange={this.handleValueChange.bind(this, 'from')}
                        value={from ? placeToForm(from).value : null}
                        query={from ? placeToForm(from).query : null}/>
        </label>
        <label className="grabr-input not-editable total">
          <FormattedMessage id="forms.offer.total"/>
          <Money value={this.getTotal()}/>
        </label>
        <h4 className="header-caps">
          <FormattedMessage id="forms.offer.details"/>
        </h4>
        <label className="grabr-input">
          <FormattedMessage id="forms.offer.fields.delivery_date.label"/>
          {this.renderError('delivery_date')}
          <DateTimeInput minDate={moment()}
                         maxDate={moment().add(24, 'days')}
                         onChange={this.handleValueChange.bind(this, 'delivery_date')}
                         value={this.state.attributes.delivery_date}/>
        </label>
        <label className="grabr-input">
          <FormattedMessage id="forms.offer.fields.comment.label"/>
          {this.renderError('comment')}
          <textarea onChange={this.handleInputChange.bind(this, 'comment')}
                    value={this.state.attributes.comment}
                    placeholder={this.context.intl.formatMessage({id: 'forms.offer.fields.comment.placeholder'})}/>
        </label>
        <label className="grabr-input grabr-input-agree">
          <FormattedHTMLMessage id="forms.offer.agree"/>
        </label>
      </fieldset>
      <section className="flex-row flex-justify-center controls">
        <SyncButton isSyncing={this.props.grab.isSyncing} type="submit">
          <FormattedMessage id="forms.offer.submit"/>
        </SyncButton>
        <button className="transparent" type="button" onClick={this.handleCancelClick.bind(this)}>
          <FormattedMessage id="shared.cancel"/>
        </button>
      </section>
    </form>;
  }
}, [GrabStore, AccountStore], ({getStore}, {grabId}) => {
  const grab = getStore(GrabStore).get(grabId);
  return {
    currentUser: getStore(AccountStore).getUser(),
    errors: grab.getErrors(),
    grab
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_offer-form/OfferForm.js