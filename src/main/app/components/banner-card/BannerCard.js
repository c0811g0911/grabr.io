import classNames from 'classnames';
import React from 'react';
import {BannerShape} from '../../models/BannerModel';
import {getImageUrl} from '../../utils/ImageUtils';
import {AppStore} from '../../stores/AppStore';
import {Picture} from '../picture/Picture';
import URI from 'urijs';
import './_banner-card.scss';
import {mixpanelClickShopLifestylebar} from '../../../3rd-party/mixpanel/MixpanelEvents';

const {func} = React.PropTypes;

export class BannerCard extends React.Component {

  static contextTypes = {
    getStore: func.isRequired
  };

  static propTypes = {
    model: BannerShape.isRequired
  };

  render() {
    const {className, model} = this.props;
    const {title, smallTitle, redTitle, lead, targetUrl, image = {}} = model;
    const appStore = this.context.getStore(AppStore);
    const Wrapper = targetUrl ? 'a' : 'div';
    const isExternal = targetUrl && URI.parse(targetUrl).hostname !== 'grabr.io';

    return <Wrapper href={targetUrl}
                    target={isExternal ? '_blank' : '_self'}
                    className={classNames('banner-card link-unstyled flex-col pos-relative', className)}
                    onClick={() => {
                      mixpanelClickShopLifestylebar(model);
                    }}>
      <div className="pos-absolute z-index-2 radius-a-infinite p-y-xs p-x-sm m-a-sm bg-transparent-pink font-size-xs text-uppercase">
        {appStore.getTranslation(lead)}
      </div>
      <Picture className="banner-card__picture z-index-0" model={{src: getImageUrl(image.url, {size: 'medium2x'})}}/>
      <div className="banner-card__title z-index-1 pos-absolute pos-b pos-x p-a-1 p-t-3">
        <h4 className="text-white">
          {appStore.getTranslation(title)}
        </h4>
        <div className="font-size-sm">
            <span className="text-white">
              {appStore.getTranslation(smallTitle)}
            </span>
          <If condition={!!redTitle}>
              <span className="text-pink m-l-space">
                {appStore.getTranslation(redTitle)}
              </span>
          </If>
        </div>
      </div>
    </Wrapper>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/banner-card/BannerCard.js