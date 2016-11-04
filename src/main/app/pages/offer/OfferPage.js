import classNames from 'classnames';
import {Link} from 'react-router/es6';
import {PaymentForm} from '../../components/_payment-form/PaymentForm';
import React from 'react';
import {acceptOffer, loadOffer} from '../../actions/GrabActionCreators';
import {AccountStore} from '../../stores/AccountStore';
import {LocalStore} from '../../stores/LocalStore';
import {connectToStores} from 'fluxible-addons-react';
import {CouponShape, shapeCoupon} from '../../models/CouponModel';
import {CouponStore, GrabStore, OfferStore} from '../../stores/DataStores';
import {createCoupon, setPaymentCoupon} from '../../actions/CouponActionCreators';
import {FormattedMessage} from 'react-intl';
import {getReceipt} from '../../helpers/getReceipt';
import {GrabShape, shapeGrab} from '../../models/GrabModel';
import {Input} from 'react-text-input';
import {Modal} from '../../components/modal/Modal';
import {MyCouponsStore} from '../../stores/SequenceStores';
import {OfferShape, shapeOffer} from '../../models/OfferModel';
import {PaymentStore} from '../../stores/PaymentStore';
import {Price} from '../../components/price/Price';
import {range} from 'lodash/util';
import {renderDate} from '../../helpers/renderDate';
import {renderFull} from '../../components/price/renderMoney';
import {Picture} from '../../components/picture/Picture';
import {StarIcon} from '../../../images/StarIcon';
import {getCardImage} from '../../helpers/getCardImage';
import {mixpanelPageViewOffer} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {shapeUser, UserShape} from '../../models/UserModel';
import {changeState} from '../../utils/stateMachines';
import './_offer.scss';
import {AppStore} from '../../stores/AppStore';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import {pushHistoryState} from '../../actions/HistoryActionCreators';
import {loadGrab} from '../../actions/GrabActionCreators';
import {loadMyCoupons} from '../../actions/CouponActionCreators';
import {Actions} from '../../actions/Constants';
import {loadAccount} from '../../actions/ProfileActionCreators';
import {Alerts} from '../../components/_alerts/Alerts';
import {Modal as LegacyModal} from '../../components/_modal/Modal';
import {CouponsForm} from '../coupons/CouponsForm';
import {trackPageView} from '../../utils/trackPageView';

const {arrayOf, func, number, string, object, bool, shape} = React.PropTypes;

export const OfferPage = connectToStores(class extends React.Component {
  static displayName = 'OfferPage';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired,
    routingProps: object,
    intl: object.isRequired
  };

  static propTypes = {
    grab: GrabShape,
    user: UserShape,
    offer: OfferShape,
    coupons: arrayOf(CouponShape),
    selectedCouponId: number,
    params: object.isRequired,
    isOfferLoaded: bool,
    isGrabLoaded: bool,
    errorMessage: string,
    location: shape({
      query: object
    })
  };

  constructor(props) {
    super(props);

    const {errorMessage} = props;

    this.state = {
      showCoupons: false,
      showAddCardForm: false,
      errorMessage
    };
  }

  componentWillMount() {
    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    const {grabId, offerId} = this.props.params;

    if (CLIENT || !this.context.getStore(GrabStore).get(grabId).isLoaded()) {
      this.context.executeAction(loadGrab, {id: grabId});
    }

    if (CLIENT || !this.context.getStore(OfferStore).get(offerId).isLoaded()) {
      this.context.executeAction(loadOffer, {offerId, grabId});
    }

    if (CLIENT || !this.context.getStore(MyCouponsStore).isLoaded()) {
      this.context.executeAction(loadMyCoupons);
    }
  }

  componentDidMount() {
    const {executeAction} = this.context;
    const {params: {grabId, offerId}, grab, offer, location: {query: {success}}} = this.props;
    executeAction(loadAccount);
    mixpanelPageViewOffer(offer.id);
    this.clearCoupon();
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `${grabId}/offer/${offerId}/payment`});

    // Special behaviour on load to redirect from Stripe 3D Secure
    if (success === 'true') {
      this.context.executeAction(pushHistoryState, [`/grabs/${ grab.id }`]);
    }
  }

  componentWillReceiveProps({params: {offerId, grabId}, selectedCouponId: couponId, errorMessage}) {
    const {executeAction} = this.context;
    const {selectedCouponId} = this.props;
    if (couponId !== selectedCouponId) {
      executeAction(loadOffer, {grabId, offerId, couponId});
    }
    this.setState({errorMessage});
  }

  //componentWillUnmount() {
  //  const {grabId, offerId} = this.props.params;
  //
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_DATA_ITEM, {id: grabId, storeName: GrabStore.storeName});
  //    context.dispatch(Actions.UNLOAD_DATA_ITEM, {id: offerId, storeName: OfferStore.storeName});
  //    this.context.executeAction(context => {
  //      context.dispatch(Actions.UNLOAD_SEQUENCE, {sequenceName: MyCouponsStore.sequenceName});
  //    });
  //  });
  //}

  handleAcceptOffer = () => {
    const {params: {offerId, grabId}, selectedCouponId: couponId} = this.props;
    this.context.executeAction(acceptOffer, {offerId, grabId, couponId});
  };

  showCoupons = () => {
    this.setState({showCoupons: true});
  };

  hideCoupons = () => {
    this.setState({showCoupons: false});
  };

  clearCoupon = () => {
    const {executeAction} = this.context;
    executeAction(setPaymentCoupon, {couponId: null});
    this.hideCoupons();
  };

  setCoupon = couponId => {
    const {executeAction} = this.context;
    executeAction(setPaymentCoupon, {couponId});
    this.hideCoupons();
  };

  openAddCardForm = () => {
    const {isEmailConfirmed} = this.props.user;

    if (isEmailConfirmed) {
      this.setState({showAddCardForm: true});
    } else {
      changeState({
        type: 'email_open',
        copy: 'accept_offer',
        context: this.context
      });
    }
  };

  render() {
    const {getStore} = this.context;
    const {offer, grab, coupons, selectedCouponId, card, isGrabLoaded, isOfferLoaded, params: {grabId}} = this.props;
    const {showCoupons, showAddCardForm, errorMessage} = this.state;
    const {consumer: receipt} = getReceipt(offer, grab);
    const {grabber, createdDate} = offer;
    const {title} = grab;
    const {firstName, grabberRating, grabberRatingCount, avatarUrl} = grabber;
    const selectedCoupon = selectedCouponId ? shapeCoupon(getStore(CouponStore).get(selectedCouponId)) : null;

    return (
      <Page>
        <Head>
          <title>{this.context.intl.formatMessage({id: 'pages.offer.document_title'})}</title>
        </Head>
        <Body>
          <div className="min-h-100 flex-col">
            <NavigationBar/>
            <div className="flex-grow">
              <Choose>
                <When condition={isGrabLoaded && isOfferLoaded}>
                  <div className="payment m-b-3">
                    <If condition={showAddCardForm}>
                      <Modal>
                        <PaymentForm onSuccess={() => {
                          this.setState({showAddCardForm: false});
                        }} onCancel={() => {
                          this.setState({showAddCardForm: false});
                        }}/>
                      </Modal>
                    </If>
                    <div className={classNames('payment__coupons', {'hidden-xs-up': !showCoupons})}>
                      <div className="container w-100 m-xs-x-1 m-sm-x-0">
                        <div className="row">
                          <div className="col-xs-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                            <div className="panel panel--xs-top-rounded panel--xs-bottom-rounded p-t-0 p-x-0">

                              <div className="text-uppercase-header bg-faded m-b-1 p-a-1">
                                <FormattedMessage id="components.coupons.new_title"/>
                              </div>
                              <CouponsForm/>

                              <div className="text-uppercase-header bg-faded m-b-1 p-a-1">
                                <FormattedMessage id="components.coupons.choose"/>
                              </div>

                              <div className="p-x-1">

                                <If condition={coupons.length === 0}>
                                  <div className="text-xs-center">
                                    <FormattedMessage id="components.coupons.no_active"/>
                                  </div>
                                </If>

                                {coupons.map(({id, description, expirationDate, value, unit}, key) => <button key={key}
                                                                                                              className="btn btn-primary btn-block coupon"
                                                                                                              onClick={() => {
                                                                                                                this.setCoupon(id);
                                                                                                              }}>
                                  <div className="coupon__price">
                                    {renderFull(value, unit)}
                                    <If condition={expirationDate}>
                                <span className="coupon__expiration p-sm-l-1">
                                  <FormattedMessage id="components.coupons.expires"/> {renderDate(expirationDate)}
                                </span>
                                    </If>
                                  </div>
                                  <div className="coupon__source">
                                    {description}
                                  </div>
                                </button>)}
                              </div>

                              <If condition={selectedCouponId}>
                                <div className="text-xs-center p-xs-t-1">
                                  <button onClick={this.clearCoupon} className="btn btn-link">
                                    <FormattedMessage id="components.coupons.reset"/>
                                  </button>
                                </div>
                              </If>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="container">

                      <h2 className="text-xs-center m-y-2">
                        <FormattedMessage id="components.payment.title"/>
                      </h2>

                      <div className="row">
                        <div className="col-lg-8 offset-lg-2 col-md-10 offset-md-1 col-xs-12">
                          <div className="panel panel--sm-top-rounded panel--sm-bottom-rounded p-x-0 p-t-0">

                            <If condition={errorMessage}>
                              <div className="p-a-1 text-danger">
                                {errorMessage}
                              </div>
                            </If>

                            <div className="text-uppercase-header bg-faded p-a-1">
                              <FormattedMessage id="components.payment.offer"/>
                            </div>

                            <div className="payment__header flex-row flex-items-center flex-justify-between">
                              <Link to={`/users/${grabber.id}`}
                                    className="flex-row text-nowrap link-unstyled font-size-sm">
                                <Picture model={{src: avatarUrl}} className="avatar avatar--lg"/>
                                <div className="m-x-space text-wrap">
                        <span className="font-weight-bold">
                          {firstName}
                        </span>
                                  <span className="m-l-space text-muted">
                          <FormattedMessage id="components.payment.offered"/> {renderDate(createdDate)}
                        </span>
                                  <br />
                                  {range(Math.round(grabberRating)).map((star, key) => <StarIcon className="offer__header-star"/>)}
                                  <If condition={grabberRatingCount > 0}>
                                    {`(${ grabberRatingCount })`}
                                  </If>
                                </div>
                              </Link>
                              <Price value={receipt.bid} currency={receipt.currency}/>
                            </div>

                            <div className="text-uppercase-header bg-faded p-a-1">
                              <FormattedMessage id="components.payment.discount"/>
                            </div>

                            <Choose>
                              <When condition={selectedCoupon}>
                                <div className="flex-row flex-justify-between flex-items-baseline m-b-1 p-x-1 p-t-1">
                                  <div>
                                    {renderFull(selectedCoupon.value, selectedCoupon.unit)}
                                  </div>
                                  <button className="btn btn-outline-primary" onClick={this.showCoupons}>
                                    <FormattedMessage id="components.payment.edit_coupon"/>
                                  </button>
                                </div>
                              </When>
                              <Otherwise>
                                <div className="m-b-1 p-x-1 p-t-1">
                                  <button className="btn btn-outline-primary btn-block" onClick={this.showCoupons}>
                                    <FormattedMessage id="components.payment.add_coupon"/>
                                  </button>
                                </div>
                              </Otherwise>
                            </Choose>

                            <div className="text-uppercase-header bg-faded p-a-1">
                              <FormattedMessage id="components.payment.payment_details"/>
                            </div>

                            <Choose>
                              <When condition={card}>
                                <div className="flex-row flex-justify-between flex-items-baseline p-a-1">
                                  <div>
                                    **** **** **** {card.last4}
                                    {(() => {
                                      const Image = getCardImage(card.brand);

                                      return <Image className="m-l-1"/>;
                                    })()}
                                  </div>
                                  <button className="btn btn-outline-primary" onClick={this.openAddCardForm}>
                                    <FormattedMessage id="components.payment.change_card"/>
                                  </button>
                                </div>
                              </When>
                              <Otherwise>
                                <div className="flex-row flex-justify-between flex-items-baseline p-a-1">
                                  <button className="btn btn-outline-primary btn-block" onClick={this.openAddCardForm}>
                                    <FormattedMessage id="components.payment.add_card"/>
                                  </button>
                                </div>
                              </Otherwise>
                            </Choose>

                            <div className="text-uppercase-header bg-faded p-a-1">
                              <FormattedMessage id="components.payment.offer_details"/>
                            </div>

                            <ul className="list-unstyled p-x-1 p-t-1">
                              <li className="flex-row flex-justify-between flex-items-center m-b-1">
                                <div>
                                  {title}
                                </div>
                                <Price className="price--small" value={receipt.itemPrice} currency={receipt.currency}/>
                              </li>
                              <li className="flex-row flex-justify-between flex-items-center m-b-1">
                                <div>
                                  <FormattedMessage id="components.payment.traveler_fee"/>
                                </div>
                                <Price className="price--small" value={receipt.bid} currency={receipt.currency}/>
                              </li>
                              <If condition={receipt.discount != 0}>
                                <li className="flex-row flex-justify-between flex-items-center m-b-1">
                                  <div>
                                    <FormattedMessage id="components.payment.discount"/>
                                  </div>
                                  <Price className="price--small" value={receipt.discount} currency={receipt.currency}/>
                                </li>
                              </If>
                              <li className="flex-row flex-justify-between flex-items-center m-b-1">
                                <div>
                                  <FormattedMessage id="components.payment.service_fee"/>
                                </div>
                                <Price className="price--small" value={receipt.applicationFee} currency={receipt.currency}/>
                              </li>
                              <li className="flex-row flex-justify-between flex-items-center m-b-1">
                                <div>
                                  <FormattedMessage id="components.payment.total"/>
                                </div>
                                <Price className="price--small" value={receipt.total} currency={receipt.currency}/>
                              </li>
                            </ul>

                            <div className="text-xs-center">
                              <button className="btn btn-primary m-r-1" onClick={this.handleAcceptOffer}>
                                <FormattedMessage id="components.payment.submit"/>
                              </button>
                              <Link className="btn btn-secondary" to={`/grabs/${grabId}`}>
                                <FormattedMessage id="shared.cancel" />
                              </Link>
                            </div>

                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </When>
                <Otherwise>
                  <div className="flex-grow flex-col flex-justify-center flex-items-center">
                    <div>
                      <FormattedMessage id="components.sync.loading"/>
                    </div>
                  </div>
                </Otherwise>
              </Choose>
            </div>
            <Footer/>
            <Alerts />
            <LegacyModal />
          </div>
        </Body>
      </Page>
    );
  }
}, [GrabStore, OfferStore, MyCouponsStore, PaymentStore, AccountStore, LocalStore], ({getStore},
  {params: {grabId, offerId}, location: {query: {success}}}) => {
  return {
    grab: shapeGrab(getStore(GrabStore).get(grabId)),
    offer: shapeOffer(getStore(OfferStore).get(offerId)),
    user: shapeUser(getStore(AccountStore).getUser()),
    isOfferLoaded: getStore(GrabStore).get(grabId).isLoaded(),
    isGrabLoaded: getStore(OfferStore).get(offerId).isLoaded(),
    coupons: getStore(MyCouponsStore).get().map(shapeCoupon),
    selectedCouponId: getStore(PaymentStore).getCouponId(),
    card: getStore(AccountStore).getCreditCard(),
    // success === 'false' corresponds to 3D Secure error
    errorMessage: success === 'false' ? getStore(AppStore).getState()
      .messages['forms.payment.fields.stripe.errors.processing_error'] : getStore(LocalStore).get('ERROR_MESSAGE')
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/offer/OfferPage.js