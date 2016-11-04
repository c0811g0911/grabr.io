import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {MyCouponsStore} from '../../stores/SequenceStores';
import {shapeCoupon, CouponShape} from '../../models/CouponModel';
import {renderDate} from '../../helpers/renderDate';
import {renderFull} from '../../components/price/renderMoney';
import {AppStore} from '../../stores/AppStore';
import {FormattedMessage} from 'react-intl';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import './_coupons.scss';
import {loadMyCoupons} from '../../actions/CouponActionCreators';
import {Alerts} from '../../components/_alerts/Alerts';
import {CouponsForm} from './CouponsForm';
import {trackPageView} from '../../utils/trackPageView';

const {arrayOf, func, object} = React.PropTypes;

export const CouponsPage = connectToStores(class extends React.Component {
  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired,
    intl: object.isRequired
  };

  static propTypes = {
    coupons: arrayOf(CouponShape)
  };

  componentWillMount() {
    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    if (CLIENT || !this.context.getStore(MyCouponsStore).isLoaded()) {
      this.context.executeAction(loadMyCoupons);
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/coupons`});
  }

  render() {
    const {coupons} = this.props;

    return  (
      <Page>
        <Head>
          <title>
            {this.context.intl.formatMessage({id: 'pages.coupons.title'})}
          </title>
        </Head>
        <Body>
          <div className="min-h-100 flex-col">
            <NavigationBar/>
            <div className="flex-grow coupons">

              <div className="container m-b-3">

                <h2 className="text-xs-center m-y-2">
                  <FormattedMessage id="components.coupons.title"/>
                </h2>

                <div className="row">
                  <div className="col-lg-8 offset-lg-2 col-md-10 offset-md-1 col-xs-12">
                    <div className="panel panel--xs-top-rounded panel--xs-bottom-rounded p-a-0">

                      <div className="text-uppercase-header bg-faded m-b-1 p-a-1">
                        <FormattedMessage id="components.coupons.new_title"/>
                      </div>
                      <CouponsForm/>

                      <div className="text-uppercase-header bg-faded p-a-1">
                        <FormattedMessage id="components.coupons.available"/>
                      </div>

                      <div className="p-a-1">
                        <If condition={coupons.length === 0}>
                          <div className="text-xs-center">
                            <FormattedMessage id="components.coupons.no_active"/>
                          </div>
                        </If>

                        {coupons.map(({description, expirationDate, value, unit}, key) =>
                          <div className="coupon coupon--outline">
                            <div className="coupon__price">
                              {renderFull(value, unit)}
                              {expirationDate && <span className="coupon__expiration p-sm-l-1">
                                  <FormattedMessage id="components.coupons.expires"/> {renderDate(expirationDate)}
                                </span>}
                            </div>
                            <div className="coupon__source">
                              {description}
                            </div>
                          </div>)}
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
            <Footer/>
            <Alerts />
          </div>
        </Body>
      </Page>
    );
  }
}, [MyCouponsStore], context => ({
  coupons: context.getStore(MyCouponsStore).get().map(shapeCoupon)
}));



// WEBPACK FOOTER //
// ./src/main/app/pages/coupons/CouponsPage.js