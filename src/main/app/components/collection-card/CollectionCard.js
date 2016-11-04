import {Link} from 'react-router/es6';
import React from 'react';
import {CalendarIcon} from '../../../images/CalendarIcon';
import {CollectionShape} from '../../models/CollectionModel';
import {getImageUrl} from '../../utils/ImageUtils';
import {FormattedMessage} from 'react-intl';
import {AppStore} from '../../stores/AppStore';
import {Picture} from '../picture/Picture';
import {renderDate} from '../../helpers/renderDate';
import {renderFull} from '../price/renderMoney';
import './_collection-card.scss';

const {func} = React.PropTypes;

const EXCHANGE_RATE = 65;

export class CollectionCard extends React.Component {
  static displayName = 'CollectionCard';

  static contextTypes = {
    getStore: func.isRequired
  };

  static propTypes = {
    collection: CollectionShape.isRequired
  };

  render() {
    const {getStore} = this.context;
    const {collection} = this.props;
    const {id, images, items, partnership, title, lead} = collection;
    const [topImage = {}] = images;
    const appStore = getStore(AppStore);
    return <Link className="collection-card link-unstyled flex-col bg-white p-b-1"
                 to={`/collections/${id}`}>
      <div className="flex-rigid pos-relative">
        <Picture className="collection-card__picture" model={{src: getImageUrl(topImage.url, {size: 'medium2x'})}}/>
        <If condition={lead}>
          <div className="collection-card__lead pos-absolute pos-x pos-b bg-transparent-pink text-xs-center">
            {appStore.getTranslation(lead)}
          </div>
        </If>
      </div>
      <div className="flex-grow m-t-1 m-x-2">
        <div className="collection-card__title">
          {appStore.getTranslation(title)}
        </div>
      </div>
      <div className="m-t-1 m-x-2">
        <If condition={items.count === 0}>
          <div className="font-size-sm text-muted">
            <FormattedMessage id="components.collection_preview.no_items"/>
          </div>
        </If>
        <If condition={items.count > 0}>
          <div className="font-size-sm text-muted">
            <span className="m-r-space">
              <FormattedMessage id="components.collection_preview.items" values={{itemsCount: items.count}}/>
            </span>
            <br />
            <span className="text-primary">
              {renderFull(items.minPrice.amount, items.minPrice.currency)}
            </span>
            <If condition={appStore.getCurrentLocale() == 'ru'}>
              {' '}
              <nobr>
                <FormattedMessage id="shared.approximate_ruble_price"
                                  values={{value: items.minPrice.amount * EXCHANGE_RATE}}/>
              </nobr>
            </If>
          </div>
        </If>
        <If condition={partnership.expiration}>
          <div className="collection-card__expiration font-size-uppercase-xs text-uppercase text-muted m-t-1 p-t-1">
            <CalendarIcon className="m-r-1 text-primary"/>
            Available until
            <div className="pull-xs-right text-primary">
              {renderDate(partnership.expiration.moment)}
            </div>
          </div>
        </If>
      </div>
    </Link>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/collection-card/CollectionCard.js