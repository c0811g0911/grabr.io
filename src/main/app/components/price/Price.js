import React from 'react';
import classNames from 'classnames';
import {renderValue, renderCurrency} from './renderMoney';
import {CircleQuestionIcon} from '../../../images/CircleQuestionIcon';
import {FormattedMessage} from 'react-intl';
import './_price.scss';

const {number, bool, string} = React.PropTypes;

const EXCHANGE_RATE = 65;

export class Price extends React.Component {
  static displayName = 'Price';

  static propTypes = {
    value: number.isRequired,
    showRub: bool,
    currency: string.isRequired
  };

  state = {
    hintShown: false
  };

  showHint = e => {
    this.setState({hintShown: true});
  };

  hideHint = e => {
    this.setState({hintShown: false});
  };

  componentDidMount() {
    if (this.props.showRub && CLIENT) {
      document.addEventListener('mousedown', this.hideHint);
    }
  }

  componentWillMount() {
    if (this.props.showRub && CLIENT) {
      document.removeEventListener('mousedown', this.hideHint);
    }
  }

  render() {
    const {value, showRub = false, currency} = this.props;
    const className = classNames('flex-col flex-grow flex-items-end price', this.props.className, {'price--small': showRub});
    return <div className={className}>
      <div className="flex-grow flex-row flex-items-start">
        <div className="price__currency">
          {renderCurrency(currency)}
        </div>
        <div className="price__value">
          {renderValue(value)}
        </div>
      </div>
      {showRub && <div className="flex-rigid pos-relative" onMouseOver={this.showHint} onMouseOut={this.hideHint}>
        <div onClick={this.showHint} className="price__hint-hot-area">
              <span className="text-muted font-size-sm">
                <FormattedMessage id="shared.approximate_ruble_price" values={{value: value * EXCHANGE_RATE}}/>
              </span>
          {' '}
          <CircleQuestionIcon className="text-primary price__question-icon"/>
        </div>

        <div className={classNames('pos-absolute pos-r bg-white price__hint font-size-sm', {'hidden-xs-up': !this.state.hintShown})}>
          <FormattedMessage id="shared.approximate_ruble_price_note" values={{exchangeRate: EXCHANGE_RATE}}/>
        </div>
      </div>}
    </div>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/price/Price.js