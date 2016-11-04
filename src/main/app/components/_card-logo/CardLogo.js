import React, {PropTypes} from 'react';
import {getCardCSSName} from '../../helpers/getCardCSSName';
import './_card-logo.scss';

export class CardLogo extends React.Component {
  static displayName = 'CardLogo';

  static propTypes = {
    type: PropTypes.string,
    number: PropTypes.string
  };

  static defaultProps = {
    number: ''
  };

  getCardType() {
    return this.props.type || Stripe.card.cardType(this.props.number);
  }

  getClassName() {
    return getCardCSSName(this.getCardType());
  }

  render() {
    const className = this.getClassName();
    if (!className) {
      return null;
    }

    return <div className={`grabr-card-logo ${ className }`}/>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_card-logo/CardLogo.js