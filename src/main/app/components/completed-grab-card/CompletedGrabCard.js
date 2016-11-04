import React from 'react';
import classNames from 'classnames';
import {Picture} from '../picture/Picture';
import {StarIcon} from '../../../images/StarIcon';
import {Link} from 'react-router/es6';
import {AirplaneConnectorIcon} from './AirplaneConnectorIcon';
import {FormattedMessage} from 'react-intl';
import './_completed-grab-card.scss';


export function CompletedGrabCard({className, data}) {
  const {
          id,
          traveler,
          consumer,
          from,
          to,
          reward,
          travelerSrc,
          consumerSrc,
          itemSrc
        } = data;

  return <Link className={classNames('completed-grab-card link-unstyled flex-col bg-white', className)}
                  to={`/grabs/${id}`}>
    <Picture className="completed-grab-card__picture" model={{src: itemSrc}}/>
    <div className="flex-grow p-x-1 p-y-2">

      <div className="flex-row flex-justify-center">
        <div className="text-xs-center">
          <Picture model={{src: travelerSrc}} className="avatar completed-grab-card__avatar"/>
          <div className="completed-grab-card__first-name">
            {traveler}
          </div>
          <div className="text-muted">
            {from}
          </div>
        </div>
        <div>
          <AirplaneConnectorIcon className="text-primary"/>
        </div>
        <div className="text-xs-center">
          <Picture model={{src: consumerSrc}} className="avatar completed-grab-card__avatar"/>
          <div className="completed-grab-card__first-name">
            {consumer}
          </div>
          <div className="text-muted">
            {to}
          </div>
        </div>
      </div>

    </div>
    <div className="completed-grab-card__footer p-a-1">
      <div className="text-xs-center m-b-1">
        <StarIcon className="icon--star-large"/>
        <StarIcon className="icon--star-large"/>
        <StarIcon className="icon--star-large"/>
        <StarIcon className="icon--star-large"/>
        <StarIcon className="icon--star-large"/>
      </div>
      <div className="text-muted text-xs-center">
          <span className="m-r-space">
            <FormattedMessage id="pages.landing.recent.reward"/>
          </span>
        <span className="text-primary">
            {reward}
          </span>
      </div>
    </div>
  </Link>;
}



// WEBPACK FOOTER //
// ./src/main/app/components/completed-grab-card/CompletedGrabCard.js