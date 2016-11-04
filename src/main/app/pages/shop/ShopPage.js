import classNames from 'classnames';
import {Link} from 'react-router/es6';
import React from 'react';
import {
  BannersStore,
  RecentGrabsStore,
  ShopPageCuratedCollectionsStore,
  ShopPageFeaturedCollectionsStore,
  ShopPagePartnerCollectionsStore,
  TopItemsStore
} from '../../stores/SequenceStores';
import {
  mixpanelClickShopPasteUrlUrlInput,
  mixpanelClickShopStartOrderUrlInput,
  mixpanelClickShopViewMoreGrabsViewMoreGrabs,
  mixpanelPageViewShop,
  mixpanelClickShopCollections
} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {AccountStore} from '../../stores/AccountStore';
import {BannerCard} from '../../components/banner-card/BannerCard';
import {ChevronLeftIcon} from '../../../images/ChevronLeftIcon';
import {ChevronRightIcon} from '../../../images/ChevronRightIcon';
import {CollectionCard} from '../../components/collection-card/CollectionCard';
import {CollectionShape, shapeCollection} from '../../models/CollectionModel';
import {connectToStores} from 'fluxible-addons-react';
import {GenericScrollBox} from 'react-scroll-box';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import {GiftIcon} from '../../../images/GiftIcon';
import {GrabCard} from '../../components/grab-card/GrabCard';
import {GrabShape, shapeGrab} from '../../models/GrabModel';
import {Input} from 'react-text-input';
import {ItemCard} from '../../components/item-card/ItemCard';
import {ItemShape, shapeItem} from '../../models/ItemModel';
import {shapeBanner, BannerShape} from '../../models/BannerModel';
import {shapeUser, UserShape} from '../../models/UserModel';
import URI from 'urijs';
import './_shop.scss';
import {AppStore} from '../../stores/AppStore';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import {pushHistoryState} from '../../actions/HistoryActionCreators';
import {loadRecentGrabs} from '../../actions/GrabActionCreators';
import {loadTopItems} from '../../actions/ItemActionCreators';
import {
  readShopPageCuratedCollections,
  readShopPageFeaturedCollections,
  readShopPagePartnerCollections
} from '../../actions/CollectionActionCreators';
import {loadBanners} from '../../actions/BannerActionCreators';
import fbImage from '../../../images/fb.png';
import {Actions} from '../../actions/Constants';
import {Alerts} from '../../components/_alerts/Alerts';
import {Modal} from '../../components/_modal/Modal';
import {trackPageView} from '../../utils/trackPageView';

const {func, arrayOf, object} = React.PropTypes;

export const ShopPage = connectToStores(class extends React.Component {
  static displayName = 'ShopPage';

  static propTypes = {
    curatedCollections: arrayOf(CollectionShape).isRequired,
    currentUser: UserShape.isRequired,
    favoriteCollections: arrayOf(CollectionShape).isRequired,
    partnerCollections: arrayOf(CollectionShape).isRequired,
    recentGrabs: arrayOf(GrabShape).isRequired,
    topItems: arrayOf(ItemShape).isRequired,
    banners: arrayOf(BannerShape).isRequired
  };

  state = {
    showArrowLeft: false,
    showArrowRight: false
  };

  onViewportScroll = scrollBox => {
    if (scrollBox.scrollX === 0) {
      this.setState({showArrowLeft: false});
    } else if (!this.state.showArrowLeft) {
      this.setState({showArrowLeft: true});
    }
    if (scrollBox.scrollX === scrollBox.scrollMaxX) {
      this.setState({showArrowRight: false});
    } else if (!this.state.showArrowRight) {
      this.setState({showArrowRight: true});
    }
  };

  onScrollPageLeft = () => {
    this.refs.bannerScrollBox.scrollBy(-this.refs.bannerScrollBox.viewport.offsetWidth, 0, 400);
  };

  onScrollPageRight = () => {
    this.refs.bannerScrollBox.scrollBy(this.refs.bannerScrollBox.viewport.offsetWidth, 0, 400);
  };

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired,
    routingProps: object,
    intl: object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {searchValue: ''};
  }

  componentWillMount() {
    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    if (CLIENT || !this.context.getStore(RecentGrabsStore).isLoaded()) {
      this.context.executeAction(loadRecentGrabs, {pageSize: 3});
    }

    if (CLIENT || !this.context.getStore(TopItemsStore).isLoaded()) {
      this.context.executeAction(loadTopItems, {count: 8});
    }

    if (CLIENT || !this.context.getStore(ShopPageCuratedCollectionsStore).isLoaded()) {
      this.context.executeAction(readShopPageCuratedCollections, {count: 4});
    }

    if (CLIENT || !this.context.getStore(ShopPageFeaturedCollectionsStore).isLoaded()) {
      this.context.executeAction(readShopPageFeaturedCollections, {count: 4});
    }

    if (CLIENT || !this.context.getStore(ShopPagePartnerCollectionsStore).isLoaded()) {
      this.context.executeAction(readShopPagePartnerCollections, {count: 4});
    }

    if (CLIENT || !this.context.getStore(BannersStore).isLoaded()) {
      this.context.executeAction(loadBanners);
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/shop`});
    mixpanelPageViewShop();
    if (this.refs.bannerScrollBox) {
      this.onViewportScroll(this.refs.bannerScrollBox);
    }
  }

  //componentWillUnmount() {
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_SEQUENCE, {
  //      sequenceNames: [
  //        RecentGrabsStore.sequenceName,
  //        TopItemsStore.sequenceName,
  //        ShopPageCuratedCollectionsStore.sequenceName,
  //        ShopPageFeaturedCollectionsStore.sequenceName,
  //        ShopPagePartnerCollectionsStore.sequenceName,
  //        BannersStore.sequenceName
  //      ]
  //    });
  //  });
  //}

  changeSearchValue = event => {
    this.setState({searchValue: event.target.value});
  };

  search = event => {
    mixpanelClickShopStartOrderUrlInput();
    event.preventDefault();
    const {searchValue} = this.state;
    const urlOrTitle = new URI(searchValue).is('absolute') ? 'url' : 'title';
    const url = URI.expand('/grabs/new{?q*}', {q: {[urlOrTitle]: searchValue}}).href();
    this.context.executeAction(pushHistoryState, [url]);
  };

  render() {
    const {
            curatedCollections, currentUser, favoriteCollections, partnerCollections, recentGrabs, topItems, banners
          } = this.props;
    const {searchValue} = this.state;
    const {intl} = this.context;

    return (
      <Page>
        <Head>
          <title>
            {intl.formatMessage({id: 'pages.shop.document_title'})}
          </title>
          <meta name="description" content={intl.formatMessage({id: 'meta.description'})}/>
          <meta property="og:type" content="website"/>
          <meta property="og:site_name" content="Grabr"/>
          <meta property="og:title" content={intl.formatMessage({id: 'meta.title'})}/>
          <meta property="og:description" content={intl.formatMessage({id: 'meta.description'})}/>
          <meta property="og:url" content="https://grabr.io"/>
          <meta property="og:image" content={fbImage}/>
        </Head>
        <Body>
        <div className="min-h-100 flex-col">
          <NavigationBar/>
          <div className="flex-grow shop m-b-3">

            <div className="shop__banner flex-row flex-items-center">
              <div className="container w-100">
                <div className="row">
                  <div className="col-xs-12
                              col-md-10 offset-md-1
                              col-lg-8 offset-lg-2">
                    <div className="text-xs-center p-xs-x-1 p-sm-x-0">
                      <h2>
                        <FormattedHTMLMessage id="pages.shop.banner.title"/>
                      </h2>
                      <p className="p-b-2">
                        <FormattedHTMLMessage id="pages.shop.banner.lead"/>
                      </p>
                      <form className="input-group hidden-xs-down" onSubmit={this.search}>
                        <Input type="text"
                               className="form-control shop__search"
                               placeholder={intl.formatMessage({id: 'pages.shop.banner.placeholder'})}
                               value={searchValue}
                               onChange={this.changeSearchValue}
                               onPaste={() => {
                                 mixpanelClickShopPasteUrlUrlInput();
                               }}/>
                        <span className="input-group-btn">
                        <button className="btn btn-primary p-x-3" type="submit">
                          <FormattedHTMLMessage id="pages.shop.banner.label"/>
                        </button>
                      </span>
                      </form>
                      <Link className="btn btn-block btn-primary hidden-sm-up" to="/grabs/new">
                        <FormattedHTMLMessage id="pages.shop.banner.label"/>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="container">
              <If condition={!currentUser.isGuest}>
                <div className="flex-row flex-items-center flex-justify-center text-nowrap bg-white hidden-sm-up">
                  <div className="flex-rigid p-l-1">
                    <GiftIcon className="text-primary"/>
                  </div>
                  <div className="flex-rigid p-a-1">
                    <div className="font-weight-bold">
                      <FormattedMessage id="pages.share.invite_on_other_pages_1"/>
                    </div>
                    <a href="/share" className="text-primary">
                      <FormattedMessage id="pages.share.invite_on_other_pages_2"/>
                    </a>
                  </div>
                </div>
              </If>

              <If condition={banners.length > 0}>
                <section>
                  <div className="shop__banner-card-list-touch hidden-md-up text-nowrap text-center m-b-1 m-t-3">
                    <div className="row flex-no-wrap shop__banner-card-list-touch-viewport">
                      {banners.map((model, key) => <div key={key}
                                                        className="d-inline-block col-xs-12 col-sm-6 text-wrap text-left">
                        <BannerCard model={model} className="h-100"/>
                      </div>)}
                    </div>
                  </div>
                  <div className="shop__banner-card-list hidden-sm-down m-b-3 m-t-3">
                    <GenericScrollBox className="shop__banner-card-list-scroll-box scroll-box--wrapped"
                                      ref="bannerScrollBox"
                                      propagateWheelScroll={true}
                                      hideScrollBarX={true}
                                      scrollableY={false}
                                      onViewportScroll={this.onViewportScroll}>
                      <div className="scroll-box__viewport">
                        <div className="flex-row flex-no-wrap h-100">
                          {banners.map((model, key) => <div key={key} className="col-md-4">
                            <BannerCard model={model} className="flex-rigid h-100"/>
                          </div>)}
                        </div>
                      </div>
                    </GenericScrollBox>
                    <div className={classNames('shop__banner-card-list-chevron-left flex-row flex-items-center', {'hidden-xs-up': !this.state.showArrowLeft})}
                         onClick={this.onScrollPageLeft}>
                      <ChevronLeftIcon />
                    </div>
                    <div className={classNames('shop__banner-card-list-chevron-right flex-row flex-items-center flex-justify-end', {'hidden-xs-up': !this.state.showArrowRight})}
                         onClick={this.onScrollPageRight}>
                      <ChevronRightIcon />
                    </div>
                  </div>
                </section>
              </If>

              <If condition={favoriteCollections.length > 0}>
                <div className="text-xs-center m-y-3 p-x-1">
                  <h2>
                    <FormattedHTMLMessage id="pages.shop.collections.favorite.title"/>
                  </h2>
                  <p>
                    <FormattedHTMLMessage id="pages.shop.collections.favorite.lead"/>
                  </p>
                </div>
                <section className="row p-x-1 m-t-1 p-sm-x-0">
                  {favoriteCollections.map((collection, key) =>
                    <div key={key}
                         className={'col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-1' +
                                    (key >= 2 ? ' hidden-xs-down' : '') +
                                    (key >= 4 ? ' hidden-sm-down' : '') +
                                    (key == 3 ? ' hidden-md-only' : '')}
                         onClick={() => {
                           mixpanelClickShopCollections(collection);
                         }}>
                      <CollectionCard collection={collection}/>
                    </div>
                  )}
                </section>
                <div className="row">
                  <div className="col-xs-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                    <div className="p-b-1 p-t-2 p-x-1 p-sm-x-0">
                      <Link className="btn btn-block btn-primary" to="/collections?type=favorite">
                        <FormattedHTMLMessage id="pages.shop.collections.favorite.view_all"/>
                      </Link>
                    </div>
                  </div>
                </div>
              </If>

              <If condition={partnerCollections.length > 0}>
                <div className="text-xs-center m-y-3 p-x-1">
                  <h2>
                    <FormattedHTMLMessage id="pages.shop.collections.partner.title"/>
                  </h2>
                  <p>
                    <FormattedHTMLMessage id="pages.shop.collections.partner.lead"/>
                  </p>
                </div>
                <section className="row p-x-1 m-t-1 p-sm-x-0">
                  {partnerCollections.map((collection, key) =>
                    <div key={key}
                         className={'col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-1' +
                                    (key >= 2 ? ' hidden-xs-down' : '') +
                                    (key >= 4 ? ' hidden-sm-down' : '') +
                                    (key == 3 ? ' hidden-md-only' : '')}
                         onClick={() => {
                           mixpanelClickShopCollections(collection);
                         }}>
                      <CollectionCard collection={collection}/>
                    </div>
                  )}
                </section>
                <div className="row">
                  <div className="col-xs-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                    <div className="p-b-1 p-t-2 p-x-1 p-sm-x-0">
                      <Link className="btn btn-block btn-primary" to="/collections?type=partner">
                        <FormattedHTMLMessage id="pages.shop.collections.partner.view_all"/>
                      </Link>
                    </div>
                  </div>
                </div>
              </If>

              <If condition={curatedCollections.length > 0}>
                <div className="text-xs-center m-y-3 p-x-1">
                  <h2>
                    <FormattedHTMLMessage id="pages.shop.collections.curated.title"/>
                  </h2>
                  <p>
                    <FormattedHTMLMessage id="pages.shop.collections.curated.lead"/>
                  </p>
                </div>
                <section className="row p-x-1 m-t-1 p-sm-x-0">
                  {curatedCollections.map((collection, key) =>
                    <div key={key}
                         className={'col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-1' +
                                    (key >= 2 ? ' hidden-xs-down' : '') +
                                    (key >= 4 ? ' hidden-sm-down ' : '') +
                                    (key == 3 ? ' hidden-md-only' : '')}
                         onClick={() => {
                           mixpanelClickShopCollections(collection);
                         }}>
                      <CollectionCard collection={collection}/>
                    </div>
                  )}
                </section>
                <div className="row">
                  <div className="col-xs-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                    <div className="p-b-1 p-t-2 p-x-1 p-sm-x-0">
                      <Link className="btn btn-block btn-primary" to="/collections?type=curated">
                        <FormattedHTMLMessage id="pages.shop.collections.curated.view_all"/>
                      </Link>
                    </div>
                  </div>
                </div>
              </If>

              <If condition={topItems.length > 0}>
                <div className="text-xs-center m-y-3 p-x-1">
                  <h2>
                    <FormattedHTMLMessage id="pages.shop.items.title"/>
                  </h2>
                  <p>
                    <FormattedHTMLMessage id="pages.shop.items.lead"/>
                  </p>
                </div>

                <section className="row m-t-1 p-x-1 p-sm-x-0">
                  {topItems.map((item, key) => <div key={key}
                                                    className={'col-xs-6 col-md-4 col-lg-3 m-b-1' +
                                                               (key >= 4 ? ' hidden-sm-down' : '') +
                                                               (key >= 6 ? ' hidden-md-down' : '')}>
                    <ItemCard item={item}/>
                  </div>)}
                </section>
              </If>

              <If condition={recentGrabs.length > 0}>
                <div className="text-xs-center m-y-3 p-x-1">
                  <h2>
                    <FormattedHTMLMessage id="pages.shop.grabs.title"/>
                  </h2>
                  <p>
                    <FormattedHTMLMessage id="pages.shop.grabs.lead"/>
                  </p>
                </div>

                <section className="row m-t-1">
                  {recentGrabs.map((grab, key) => <div key={key} className="col-xs-12 col-lg-10 offset-lg-1 m-b-1">
                    <GrabCard grab={grab}
                              user={currentUser}
                              mixpanelClickGrabCardPage="Shop"
                              className="grab-card--large"/>
                  </div>)}
                </section>

                <div className="row">
                  <div className="col-xs-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                    <div className="p-b-1 p-t-2 p-x-1 p-sm-x-0">
                      <Link className="btn btn-block btn-primary" to="/travel" onClick={() => {
                        mixpanelClickShopViewMoreGrabsViewMoreGrabs();
                      }}>
                        <FormattedHTMLMessage id="pages.shop.grabs.label"/>
                      </Link>
                    </div>
                  </div>
                </div>
              </If>

            </div>
          </div>
          <Footer/>
          <Alerts />
          <Modal />
        </div>
        </Body>
      </Page>
    );
  }
}, [
  RecentGrabsStore,
  ShopPageCuratedCollectionsStore,
  ShopPageFeaturedCollectionsStore,
  ShopPagePartnerCollectionsStore,
  TopItemsStore,
  BannersStore
], ({getStore}) => {
  return {
    banners: getStore(BannersStore).get().map(shapeBanner),
    curatedCollections: getStore(ShopPageCuratedCollectionsStore).get().map(shapeCollection),
    currentUser: shapeUser(getStore(AccountStore).getUser()),
    favoriteCollections: getStore(ShopPageFeaturedCollectionsStore).get().map(shapeCollection),
    partnerCollections: getStore(ShopPagePartnerCollectionsStore).get().map(shapeCollection),
    recentGrabs: getStore(RecentGrabsStore).get().map(shapeGrab),
    topItems: getStore(TopItemsStore).get().map(shapeItem)
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/shop/ShopPage.js