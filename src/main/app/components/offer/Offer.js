import {cancelOffer} from '../../actions/GrabActionCreators';
import {isUserGrabOwner} from '../../helpers/isUserGrabOwner';
import {isUserOfferOwner} from '../../helpers/isUserOfferOwner';
import {canUserEditOffer} from '../../helpers/canUserEditOffer';
import {canUserMessageGrabber} from '../../helpers/canUserMessageGrabber';
import {getImageUrl} from '../../utils/ImageUtils';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import {GrabShape} from '../../models/GrabModel';
import {AppStore} from '../../stores/AppStore';
import {MessageIcon} from '../../../images/MessageIcon';
import {Link} from 'react-router/es6';
import {OfferShape} from '../../models/OfferModel';
import {Picture} from '../picture/Picture';
import {Price} from '../price/Price';
import {range} from 'lodash/util';
import React from 'react';
import {StarIcon} from '../../../images/StarIcon';
import {UserShape} from '../../models/UserModel';
import {renderDate, renderDateFromNow} from '../../helpers/renderDate';
import './_offer.scss';

const {func} = React.PropTypes;

export class Offer extends React.Component {
  static displayName = 'Offer';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired
  };

  static propTypes = {
    grab: GrabShape.isRequired,
    offer: OfferShape.isRequired,
    user: UserShape.isRequired
  };

  render() {
    const {executeAction, getStore} = this.context;
    const {grab, offer, user} = this.props;
    const {bid, bidCurrency, conversationId, createdDate, deliveryDate, from, grabber, comment} = offer;
    const {avatarUrl, firstName, grabberRating, grabberRatingCount} = grabber;
    const appStore = getStore(AppStore);
    return <div className="offer bg-white">
      <div className="offer__header flex-row flex-items-center flex-justify-between">
        <Link className="flex-row text-nowrap link-unstyled font-size-sm"
              to={`/users/${grabber.id}`}>
          <Picture model={{src: getImageUrl(avatarUrl, {size: 'tiny'})}} className="avatar avatar--lg"/>
          <div className="m-x-space text-wrap">
            <span className="font-weight-bold">
              {firstName}
            </span>
            <span className="m-l-space text-muted">
              <FormattedMessage id="components.offer.consumer"/> {renderDateFromNow(createdDate)}
            </span>
            <br/>
            {range(Math.round(grabberRating)).map((star, key) =>
              <StarIcon key={key} className="offer__header-star"/>
            )}
            <If condition={grabberRatingCount > 0}>
              ({grabberRatingCount})
            </If>
          </div>
        </Link>
        <Price value={bid} currency={bidCurrency}/>
      </div>

      <ul className="icon-list font-size-sm p-x-1">
        <If condition={from}>
          <li className="icon-list__li">
            <div className="icon-list__li-content">
          <span className="text-muted m-r-space">
            <FormattedMessage id="components.offer.from"/>
          </span>
              <span className="text-primary pull-xs-right">
            <If condition={from.translations}>
              {appStore.getTranslation(from.translations)}
            </If>
          </span>
            </div>
          </li>
        </If>
        <li className="icon-list__li">
          <div className="icon-list__li-content">
              <span className="text-muted m-r-space">
                <FormattedMessage id="components.offer.delivery_date"/>
              </span>
            <span className="text-primary pull-xs-right">
                {renderDate(deliveryDate)}
              </span>
          </div>
        </li>
        <If condition={comment && (isUserGrabOwner({grab, user}) || isUserOfferOwner({offer, user}))}>
          <li className="icon-list__li">
            <div className="icon-list__li-content">
              {comment}
            </div>
          </li>
        </If>
      </ul>
      <If condition={
        isUserGrabOwner({grab, user}) ||
        isUserOfferOwner({offer, user}) ||
        canUserEditOffer({offer, user}) ||
        canUserMessageGrabber({grab, user})
      }>
        <div className="offer__footer p-x-1 p-t-1">
          <If condition={canUserMessageGrabber({grab, user})}>
            <Link className="offer__message-btn btn btn-block btn-outline-secondary m-b-1"
                  to={conversationId ?
                      `/conversations/${conversationId}` :
                      `/grabs/${grab.id}/conversations/new`}>
              <MessageIcon className="offer__message-btn-icon"/>
              <FormattedHTMLMessage id="components.offer.send_message" values={{name: firstName}}/>
            </Link>
          </If>
          <If condition={isUserGrabOwner({grab, user})}>
            <Link className="btn btn-block btn-primary m-b-1"
                  to={`/grabs/${grab.id}/offer/${offer.id}/payment`}>
              <FormattedMessage id="components.offer.accept"/>
            </Link>
          </If>
          <If condition={canUserEditOffer({offer, user})}>
            <Link className="btn btn-block btn-primary m-b-1" to={`/grabs/${grab.id}/offer/new`}>
              <FormattedMessage id="components.offer.edit"/>
            </Link>
          </If>
          <If condition={isUserOfferOwner({offer, user})}>
            <button className="btn btn-block btn-danger m-b-1"
                    onClick={() => executeAction(cancelOffer, {grabId: grab.id, offerId: offer.id})}>
              <FormattedMessage id="components.offer.cancel"/>
            </button>
          </If>
        </div>
      </If>
    </div>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/offer/Offer.js