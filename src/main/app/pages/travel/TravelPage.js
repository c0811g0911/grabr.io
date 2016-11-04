import {InfiniteScroll} from '../../components/_infinite-scroll/InfiniteScroll';
import {Paginator} from '../../utils/Paginator';
import React from 'react';
import classNames from 'classnames';
import {AccountStore} from '../../stores/AccountStore';
import {connectToStores} from 'fluxible-addons-react';
import {FormattedMessage} from 'react-intl';
import {GrabFormTo, GrabFormFrom} from '../../components/_cities-suggest/CitiesSuggest';
import {GrabCard} from '../../components/grab-card/GrabCard';
import {Input} from 'react-text-input';
import {AppStore} from '../../stores/AppStore';
import {loadRecentGrabs} from '../../actions/GrabActionCreators';
import {
  mixpanelClickTravelFindGrabsFilterGrabRequests,
  mixpanelPageViewTravel
} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {PopularDirection} from './PopularDirection';
import {RecentGrabsStore, PopularCities} from '../../stores/SequenceStores';
import {shapeCity} from '../../models/CityModel';
import {shapeGrab} from '../../models/GrabModel';
import {shapeUser} from '../../models/UserModel';
import URI from 'urijs';
import {GiftIcon} from '../../../images/GiftIcon';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import './_travel.scss';
import {loadPopularCities} from '../../actions/TravelerActionCreators';
import {pushHistoryState} from '../../actions/HistoryActionCreators';
import {Alerts} from '../../components/_alerts/Alerts';
import {Modal} from '../../components/_modal/Modal';
import {trackPageView} from '../../utils/trackPageView';
import {Actions} from '../../actions/Constants';

const {func, object} = React.PropTypes;

export const TravelPage = connectToStores(class extends React.Component {
  static displayName = 'TravelPage';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired,
    routingProps: object,
    intl: object.isRequired
  };

  state = {
    from: null,
    to: null
  };

  componentWillMount() {
    this.paginator = new Paginator(this.context, {
      pageSize: 10,
      storeName: RecentGrabsStore.storeName,
      action: loadRecentGrabs
    });

    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    if (CLIENT || !this.context.getStore(PopularCities).isLoaded()) {
      this.context.executeAction(loadPopularCities, {count: 8});
    }

    if (CLIENT || !this.context.getStore(RecentGrabsStore).isLoaded()) {
      this.paginator.reload();
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    mixpanelPageViewTravel();
    trackPageView(this.context, {path: `/travel`});
  }

  componentWillUnmount() {
    this.context.executeAction(context => {
      context.dispatch(Actions.UNLOAD_SEQUENCE, {sequenceName: RecentGrabsStore.sequenceName});
    });
  }

  navigate() {
    const {from: from$, to: to$} = this.state;
    const from = from$ ? from$.id : undefined;
    const to = to$ ? to$.id : undefined;
    let url;
    switch (true) {
      case isFinite(from) && isFinite(to):
        url = URI.expand('/travel/from{/from}/to{/to}', {from, to}).href();
        break;
      case isFinite(from):
        url = URI.expand('/travel/from{/from}', {from}).href();
        break;
      case isFinite(to):
        url = URI.expand('/travel/to{/to}', {to}).href();
        break;
      default:
        url = undefined;
    }
    if (url) {
      mixpanelClickTravelFindGrabsFilterGrabRequests();
      this.context.executeAction(pushHistoryState, [url]);
    }
  }

  render() {
    const {popularCities, recentGrabs, currentUser} = this.props;
    const {from, to} = this.state;
    const name = city => {
      if (city && city.translations) {
        return this.context.getStore(AppStore).getTranslation(city.translations);
      }
      return '';
    };
    return (
      <Page>
        <Head>
          <title>{this.context.intl.formatMessage({id: 'pages.travel.document_title'})}</title>
        </Head>
        <Body>
        <div>
          <NavigationBar/>
          <div className="travel m-xs-b-3">
            <div className="travel__banner m-xs-b-2">

              <div className="travel__banner-body">
                <h2>
                  <FormattedMessage id="pages.travel.title"/>
                </h2>
                <p className="m-b-0">
                  <FormattedMessage id="pages.travel.lead"/>
                </p>
              </div>

              <div className="travel__banner-foot p-xs-t-1 p-xs-b-2">
                <div className="container">
                  <div className="row">

                    <div className="col-xs-12">
                      <div className="text-uppercase-header text-xs-center m-b-1">
                        <FormattedMessage id="pages.travel.filter"/>
                      </div>
                    </div>

                    <div className="col-xs-12 col-lg-10 offset-lg-1">
                      <div className="travel__banner-form">

                        <div className="form-control travel__banner-input">
                          <div className={classNames('travel__banner-input-label text-muted m-xs-r-space', {'hidden-xs-up': !from})}>
                            <FormattedMessage id="pages.travel.from"/>
                          </div>
                          <GrabFormFrom onChange={from => {
                            this.setState({from: from ? shapeCity(from) : undefined});
                          }} value={from} query={name(from)} placeholderKey="pages.travel.from_placeholder"/>
                        </div>
                        <div className="form-control travel__banner-input">
                          <div className={classNames('travel__banner-input-label text-muted m-xs-r-space', {'hidden-xs-up': !to})}>
                            <FormattedMessage id="pages.travel.to"/>
                          </div>
                          <GrabFormTo onChange={to => {
                            this.setState({to: to ? shapeCity(to) : undefined});
                          }} value={to} query={name(to)} placeholderKey="pages.travel.to_placeholder"/>
                        </div>
                        <button className="btn btn-primary travel__banner-form-btn p-md-x-3"
                                type="button"
                                onClick={() => {
                                  this.navigate();
                                }}>
                          <FormattedMessage id="pages.travel.find"/>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div className="container">
              {!currentUser.isGuest &&
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
               </div>}

              <div className="text-xs-center m-xs-y-2 p-xs-x-1">
                <h2>
                  <FormattedMessage id="pages.travel.directions_title"/>
                </h2>
                <p>
                  <FormattedMessage id="pages.travel.directions_lead"/>
                </p>
              </div>
              <section className="row">
                {popularCities.map((city, key) => <div key={key}
                                                       className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-xs-b-1">
                  <PopularDirection city={city}/>
                </div>)}
              </section>

              <div className="text-xs-center m-xs-y-2 p-xs-x-1 m-b-1">
                <h2>
                  <FormattedMessage id="pages.travel.recent_title"/>
                </h2>
                <p>
                  <FormattedMessage id="pages.travel.recent_lead"/>
                </p>
              </div>
              <InfiniteScroll wrapper={"div"}
                              hasMore={this.paginator.hasMore()}
                              isSyncing={this.paginator.isSyncing()}
                              onScroll={() => {
                                this.paginator.loadMore();
                              }}
                              moreButton={true}
                              count={recentGrabs.length}>
                <section className="row m-t-1">
                  {recentGrabs.map((grab, key) => <div key={key} className="col-xs-12 col-lg-10 offset-lg-1 m-b-1">
                    <GrabCard grab={grab}
                              user={currentUser}
                              mixpanelClickGrabCardPage="Travel"
                              className="grab-card--large"/>
                  </div>)}
                </section>
              </InfiniteScroll>
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
}, [RecentGrabsStore, PopularCities], ({getStore}) => ({
  popularCities: getStore(PopularCities).get().map(shapeCity),
  recentGrabs: getStore(RecentGrabsStore).get().map(shapeGrab),
  currentUser: shapeUser(getStore(AccountStore).getUser())
}));



// WEBPACK FOOTER //
// ./src/main/app/pages/travel/TravelPage.js