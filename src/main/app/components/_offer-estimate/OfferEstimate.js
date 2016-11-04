import React from 'react';
import {Money} from '../_money/Money';
import {ItemsPrice} from '../_items-price/ItemsPrice';
import {FormattedMessage} from 'react-intl';
import {getReceipt} from '../../helpers/getReceipt';
import {shapeOffer} from '../../models/OfferModel';
import {shapeGrab} from '../../models/GrabModel';
import {AccountStore} from '../../stores/AccountStore';
import './_offer-estimate.scss';

const {func, any} = React.PropTypes;

export class OfferEstimate extends React.Component {
  static displayName = 'OfferEstimate';

  static contextTypes = {
    getStore: func.isRequired
  };

  static propTypes = {
    grab: any.isRequired,
    offer: any.isRequired
  };

  render() {
    const {grab, offer} = this.props;
    const isConsumer = grab.isConsumer(this.context.getStore(AccountStore).getUser());
    const receipt = getReceipt(shapeOffer(offer), shapeGrab(grab))[isConsumer ? 'consumer' : 'grabber'];
    return <ul className="grabr-estimate">
      <ItemsPrice grab={grab}/>
      <li>
        <FormattedMessage id="components.offer_estimate.traveler_fee"/>
        <Money value={receipt.bid * 100}/>
      </li>
      <If condition={!!receipt.discount}>
        <li>
          <FormattedMessage id="components.offer_estimate.promocode"/>
          <Money value={-receipt.discount * 100}/>
        </li>
      </If>
      <If condition={!!receipt.applicationFee}>
        <li>
          <FormattedMessage id="components.offer_estimate.service_fee"/>
          <Money value={receipt.applicationFee * 100}/>
        </li>
      </If>
      <li>
        <FormattedMessage id="components.offer_estimate.total"/>
        <Money value={receipt.total * 100}/>
      </li>
    </ul>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_offer-estimate/OfferEstimate.js