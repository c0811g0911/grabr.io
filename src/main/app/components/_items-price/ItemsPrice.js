import React, {PropTypes} from 'react';
import {Money} from '../_money/Money';
import {Link} from 'react-router/es6';
import './_items-price.scss';

export class ItemsPrice extends React.Component {
  static displayName = 'ItemsPrice';

  static contextTypes = {
    getStore: PropTypes.func.isRequired
  };

  static propTypes = {
    grab: PropTypes.any.isRequired
  };

  // Renderers
  //
  renderQuantity(grab) {
    if (grab.get('quantity') === 1) {
      return null;
    }

    return ` ($${ grab.get('item_price_cents') / 100 } x${ grab.get('quantity') })`;
  }

  renderItems() {
    const {grab} = this.props;
    const item = grab.getItem();

    let link;
    // if (item.get('public')) {
    link = <Link className="info link-unstyled" to={`/items/${item.get('id')}`}>
      {item.get('title')}
      {this.renderQuantity(grab)}
    </Link>;
    // } else {
    //   link = (
    //     <a href={item.get('shop_url')}>
    //       { item.get("title") }
    //       { this.renderQuantity(grab) }
    //     </a>
    //   );
    // }

    return <li className="item" key={item.get('id')}>
      {link}
      <Money value={grab.getItemPrice()}/>
    </li>;
  }

  render() {
    return <ul className="items">
      {this.renderItems()}
    </ul>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_items-price/ItemsPrice.js