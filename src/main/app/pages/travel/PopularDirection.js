import {Link} from 'react-router/es6';
import React from 'react';
import {CityShape} from '../../models/CityModel';
import {FormattedMessage} from 'react-intl';
import {mixpanelClickTravelDestinations} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {renderFull} from '../../components/price/renderMoney';
import URI from 'urijs';
import {ChevronRightIcon} from '../../../images/ChevronRightIcon';
import './_popular-direction.scss';
import {AppStore} from '../../stores/AppStore';

const {func} = React.PropTypes;

export class PopularDirection extends React.Component {
  static displayName = 'PopularDirection';

  static contextTypes = {
    getStore: func.isRequired
  };

  static propTypes = {
    city: CityShape.isRequired
  };

  render() {
    const {getStore} = this.context;
    const {city} = this.props;
    const {id, imageUrl, grabsCount, offersCount, reward, rewardCurrency, translations} = city;
    return <div className="popular-direction">
      <Link className="d-block link-unstyled" to={URI.expand('/travel/to{/id}', {id}).href()} onClick={() => {
        mixpanelClickTravelDestinations(city);
      }}>
        <h4 className="popular-direction__title">
          {getStore(AppStore).getTranslation(translations)}
        </h4>
        <div className="popular-direction__subtitle">
          <FormattedMessage id="components.popular_direction.grabs" values={{grabsCount}}/> ·
          <FormattedMessage id="components.popular_direction.offers" values={{offersCount}}/>
        </div>
        <div className="popular-direction__img-wrapper">
          <img className="popular-direction__img" src={imageUrl}/>
        </div>
        <div className="popular-direction__foot">
          <div className="popular-direction__cash-amount m-xs-r-space">
            {renderFull(reward, rewardCurrency)}
          </div>
          <div className="popular-direction__label">
            <FormattedMessage id="components.popular_direction.reward"/>
          </div>
          <div className="popular-direction__icon">
            <ChevronRightIcon />
          </div>
        </div>
      </Link>
    </div>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/pages/travel/PopularDirection.js