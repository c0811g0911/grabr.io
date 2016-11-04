import React, {PropTypes} from 'react';
import {Link} from 'react-router/es6';
import {Money} from '../_money/Money';
import {UserPreview} from '../_user-preview/UserPreview';
import {getImageUrl} from '../../utils/ImageUtils';
import {FormattedMessage} from 'react-intl';
import {AccountStore} from '../../stores/AccountStore';
import './_grab-preview.scss';

export class GrabPreview extends React.Component {
  static displayName = 'GrabCard';

  static contextTypes = {
    getStore: PropTypes.func.isRequired
  };

  static propTypes = {
    grab: PropTypes.any.isRequired
  };

  getCurrentUser() {
    return this.context.getStore(AccountStore).getUser();
  }

  isCurrentUserConsumer() {
    return this.props.grab.get('consumer').get('id') === this.getCurrentUser().get('id');
  }

  hasCurrentUserMadeOffer() {
    return this.props.grab.get('has_my_offer');
  }

  canMakeOffer() {
    return !this.isCurrentUserConsumer() && this.props.grab.isPending();
  }

  renderQuantity(grab) {
    if (grab.get('quantity') === 1) {
      return null;
    }

    return ` (x${ grab.get('quantity') })`;
  }

  renderOfferCount() {
    const {grab} = this.props;
    const count = grab.get('offers_count');

    if (!grab.isPending()) {
      return null;
    }
    if (count === 0) {
      return null;
    }

    return <Link className="offers-count link-unstyled" to={`/grabs/${grab.get('id')}`}>
      <FormattedMessage id="components.grab_preview.offers" values={{count: count || 0}}/>
    </Link>;
  }

  renderMakeOfferLink() {
    if (!this.canMakeOffer()) {
      return null;
    }

    const labelKey = this.hasCurrentUserMadeOffer() ? 'edit_offer_label' : 'make_offer_label';

    return <Link className="link-unstyled" to={`/grabs/${this.props.grab.get('id')}/offer/new`}>
      <FormattedMessage id={`components.grab_preview.${labelKey}`}/>
    </Link>;
  }

  renderImage() {
    const {grab} = this.props;
    if (!grab.getTitleImage()) {
      return null;
    }

    return <div className="image">
      <img src={getImageUrl(grab.getTitleImage(), {size: 'medium'})}/>
    </div>;
  }

  render() {
    const grab = this.props.grab;

    return <article className="grab-preview-old">
      <UserPreview user={grab.get('consumer')} onlyAvatar={true}/>

      <div className="wrapper">
        <Link className="grab-info link-unstyled" to={`/grabs/${grab.get('id')}`}>
          <h4>
            <b>{grab.get('consumer').getName()}</b>
            <FormattedMessage id="components.grab_preview.is_looking"/>
            <b>{grab.get('title')}</b>
            {this.renderQuantity(grab)}
          </h4>
          <div>
            <FormattedMessage id="components.grab_preview.deliver"/>
            {grab.getTo()}
          </div>
          <div>
            <FormattedMessage id="components.grab_preview.price"/>
            <Money value={grab.getItemPrice()}/>
          </div>
          <div>
            <FormattedMessage id="components.grab_preview.reward"/>
            <Money value={grab.get('reward_cents')}/>
          </div>
          {this.renderImage()}
        </Link>
        <div className="more">
          {this.renderOfferCount(grab)}
          {this.renderMakeOfferLink(grab)}
        </div>
      </div>
    </article>;
  }

}



// WEBPACK FOOTER //
// ./src/main/app/components/_grab-preview/GrabPreview.js