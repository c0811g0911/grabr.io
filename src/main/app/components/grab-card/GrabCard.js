import {AirplaneIcon} from '../../../images/AirplaneIcon';
import {CalendarIcon} from '../../../images/CalendarIcon';
import {canUserMakeOffer} from '../../helpers/canUserMakeOffer';
import classNames from 'classnames';
import {getImageUrl} from '../../utils/ImageUtils';
import {GrabShape} from '../../models/GrabModel';
import {Picture} from '../picture/Picture';
import React from 'react';
import {renderFull} from '../../components/price/renderMoney';
import {RouteConnectorIcon} from '../../../images/RouteConnectorIcon';
import {UserShape} from '../../models/UserModel';
import {
  mixpanelClickGrabCardImage,
  mixpanelClickGrabCardMakeOffer,
  mixpanelClickGrabCardTitle,
  mixpanelClickGrabCardUser
} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {renderDate, renderDateFromNow} from '../../helpers/renderDate';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router/es6';
import './_grab-card.scss';
import {AppStore} from '../../stores/AppStore';

const {func, object, string} = React.PropTypes;

export class GrabCard extends React.Component {
  static displayName = 'GrabCard';

  static contextTypes = {
    getStore: func.isRequired,
    intl: object.isRequired
  };

  static propTypes = {
    className: string,
    grab: GrabShape.isRequired,
    user: UserShape.isRequired
  };

  render() {
    const {className, grab, user} = this.props;
    const {
            consumer, createdDate, dueDate, from, hasMyOffer, id, imageUrl, offerBids, offersCount, reward, rewardCurrency,
            title, to
          } = grab;
    const appStore = this.context.getStore(AppStore);

    var priceBlock = <Choose>
      <When condition={offersCount === 1}>
            <span className="text-primary m-l-space">
              {renderFull(offerBids[0], 'USD')}
            </span>
      </When>
      <When condition={offersCount > 1}>
            <span className="text-primary m-l-space">
              {renderFull(Math.min(...offerBids), 'USD')}
              -
              {renderFull(Math.max(...offerBids), 'USD')}
            </span>
      </When>
    </Choose>;

    return <div className={classNames('grab-card flex-row bg-white', className)}>
      <Link className="grab-card__picture-holder grab-card__picture-holder--large flex-rigid" to={`/grabs/${ id }`}>
        <Picture model={{src: getImageUrl(imageUrl, {size: 'large'})}} className="grab-card__picture"/>
      </Link>
      <div className="flex-col flex-grow">

        <div className="grab-card__header flex-row flex-items-baseline font-size-sm">
          <Link className="d-block link-unstyled text-nowrap"
                to={`/users/${ consumer.id }`}
                onClick={mixpanelClickGrabCardUser}>
            <Picture model={{src: getImageUrl(consumer.avatarUrl, {size: 'tiny'})}} className="avatar"/>
            <span className="m-l-space font-weight-bold">
                {consumer.firstName}
              </span>
            <span className="m-l-space text-muted">
                <FormattedMessage id="components.grab_preview_v2.consumer"/>
              </span>
          </Link>
          <div className="flex-grow text-muted text-xs-right">
            {renderDateFromNow(createdDate)}
          </div>
        </div>

        <Link className="flex-grow flex-row link-unstyled" to={`/grabs/${ id }`}>
          <div className="grab-card__picture-holder grab-card__picture-holder--small flex-rigid"
               onClick={mixpanelClickGrabCardImage}>
            <Picture model={{src: imageUrl}} className="grab-card__picture"/>
          </div>
          <div className="flex-col flex-grow p-x-1 p-t-1">
            <div className="grab-card__title" onClick={mixpanelClickGrabCardTitle}>
              {title}
            </div>
            <div className="flex-grow flex-row flex-items-end">

              <ul className="icon-list w-100 font-size-sm m-xs-b-1 m-sm-b-0">
                <If condition={to}>
                  <li className="icon-list__li">
                    <div className="icon-list__li-icon hidden-xs-down">
                      <RouteConnectorIcon className="grab-card__route-icon text-primary"/>
                    </div>
                    <div className="icon-list__li-content grab-card__li-content">
                      <span className="text-muted m-r-space">
                        <FormattedMessage id="components.grab_preview_v2.to"/>
                      </span>
                      <wbr/>
                      <span className="text-primary pull-sm-right">
                        <If condition={to.translations}>
                          {appStore.getTranslation(to.translations)}
                        </If>
                      </span>
                    </div>
                  </li>
                </If>
                <li className="icon-list__li">
                  <div className="icon-list__li-icon hidden-xs-down"/>
                  <div className="icon-list__li-content grab-card__li-content">
                    <span className="text-muted m-r-space">
                      <FormattedMessage id="components.grab_preview_v2.from"/>
                    </span>
                    <wbr />
                    <span className="text-primary pull-sm-right">
                      <Choose>
                        <When condition={from && from.translations}>
                          {appStore.getTranslation(from.translations)}
                        </When>
                        <Otherwise>
                          {this.context.intl.formatMessage({id: 'shared.anywhere'})}
                        </Otherwise>
                      </Choose>
                    </span>
                  </div>
                </li>
                <If condition={dueDate}>
                  <li className="icon-list__li">
                    <div className="icon-list__li-icon hidden-xs-down">
                      <CalendarIcon className="text-primary"/>
                    </div>
                    <div className="icon-list__li-content grab-card__li-content">
                      <span className="text-muted m-r-space">
                        <FormattedMessage id="components.grab_preview_v2.due_date"/>
                      </span>
                      <wbr/>
                      <span className="text-primary pull-sm-right">
                        {renderDate(dueDate)}
                      </span>
                    </div>
                  </li>
                </If>
              </ul>
            </div>
          </div>
        </Link>

        <div className="grab-card__footer flex-row flex-justify-between text-nowrap font-size-sm">

          <Choose>
            <When condition={offersCount === 0}>
              <div className="text-muted">
                <FormattedMessage id="components.grab_preview_v2.reward"/>
                <span className="m-l-space text-primary">
                      {renderFull(reward, rewardCurrency)}
                    </span>
                {priceBlock}
              </div>
            </When>
            <Otherwise>
              <div className="text-muted">
                <FormattedMessage id="components.grab_preview_v2.offers" values={{offersCount}}/>
                {priceBlock}
              </div>
            </Otherwise>
          </Choose>

          <If condition={canUserMakeOffer({grab, user})}>
            <Choose>
              <When condition={hasMyOffer}>
                <div className="text-muted">
                  <AirplaneIcon className="m-r-space"/>
                  <FormattedMessage id="components.grab_preview_v2.offer_made"/>
                </div>
              </When>
              <Otherwise>
                <Link className="text-primary"
                      to={`/grabs/${ id }/offer/new`}
                      onClick={mixpanelClickGrabCardMakeOffer}>
                  <AirplaneIcon className="m-r-space text-muted"/>
                  <FormattedMessage id="components.grab_preview_v2.make_offer"/>
                </Link>
              </Otherwise>
            </Choose>
          </If>

        </div>

      </div>
    </div>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/grab-card/GrabCard.js