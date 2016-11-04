import React from 'react';
import {getImageUrl} from '../../utils/ImageUtils';
import {AppStore} from '../../stores/AppStore';
import {ItemShape} from '../../models/ItemModel';
import {Picture} from '../picture/Picture';
import {renderFull} from '../price/renderMoney';
import URI from 'urijs';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router/es6';
import './_item-card.scss';

const {func} = React.PropTypes;

const EXCHANGE_RATE = 65;

export class ItemCard extends React.Component {
  static displayName = 'ItemCard';

  static contextTypes = {
    getStore: func.isRequired
  };

  static propTypes = {
    item: ItemShape.isRequired
  };

  render() {
    const {item} = this.props;
    const {id, imageUrl, price, priceCurrency, shopUrl, title, lead} = item;
    const appStore = this.context.getStore(AppStore);
    return (
      <Link className="item-card flex-col link-unstyled bg-white p-b-1" to={`/items/${id}`}>
        <div className="flex-rigid pos-relative">
          <Picture className="item-card__picture" model={{src: getImageUrl(imageUrl, {size: 'medium2x'})}}/>
          <If condition={lead}>
            <div className="item-card__lead pos-absolute pos-x pos-b bg-transparent-pink text-xs-center">
              {appStore.getTranslation(lead)}
            </div>
          </If>
        </div>
        <div className="flex-grow m-t-1 m-x-2">
          <div className="item-card__title">
            {title}
          </div>
        </div>
        <div className="m-t-space m-x-2 font-size-sm">
            <span className="text-muted m-r-space">
              <If condition={!shopUrl}>
                <FormattedMessage id="components.item_preview.price"/>
              </If>
              <If condition={shopUrl}>
                <span>
                  <FormattedMessage id="components.item_preview.price_from_url"/>
                  {new URI(shopUrl).domain()}:
                </span>
              </If>
            </span>
          <br />
          <span className="text-primary">
            {renderFull(price, priceCurrency)}
          </span>
          <If condition={appStore.getCurrentLocale() == 'ru'}>
            {' '}
            <nobr>
              <FormattedMessage id="shared.approximate_ruble_price" values={{value: price * EXCHANGE_RATE}}/>
            </nobr>
          </If>
        </div>
      </Link>
    );
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/item-card/ItemCard.js