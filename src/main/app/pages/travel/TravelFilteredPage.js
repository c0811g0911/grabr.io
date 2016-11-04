import {InfiniteScroll} from '../../components/_infinite-scroll/InfiniteScroll';
import {Paginator} from '../../utils/Paginator';
import React from 'react';
import uuid from 'node-uuid';
import {AccountStore} from '../../stores/AccountStore';
import {CityStore, ItinerarySubscriptionStore, CountryStore} from '../../stores/DataStores';
import {connectToStores} from 'fluxible-addons-react';
import {createSubscription} from '../../actions/ItineraryActionCreators';
import {LocationShape, shapeLocation} from '../../models/LocationModel';
import {FormattedMessage} from 'react-intl';
import {GrabFormTo, GrabFormFrom} from '../../components/_cities-suggest/CitiesSuggest';
import {GrabCard} from '../../components/grab-card/GrabCard';
import {AppStore} from '../../stores/AppStore';
import {ItinerarySubscriptionShape, shapeItinerarySubscription} from '../../models/ItinerarySubscriptionModel';
import {loadRecentGrabs} from '../../actions/GrabActionCreators';
import {mixpanelPageViewTravel} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {RecentGrabsStore} from '../../stores/SequenceStores';
import {shapeCity, CityShape} from '../../models/CityModel';
import {shapeGrab, GrabShape} from '../../models/GrabModel';
import {shapeUser, UserShape} from '../../models/UserModel';
import URI from 'urijs';
import {TimesIcon} from '../../../images/TimesIcon';
import './_travel.scss';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import {pushHistoryState} from '../../actions/HistoryActionCreators';
import {loadCity} from '../../actions/TravelerActionCreators';
import {Actions} from '../../actions/Constants';
import {Alerts} from '../../components/_alerts/Alerts';
import {Modal} from '../../components/_modal/Modal';
import {trackPageView} from '../../utils/trackPageView';

const {func, arrayOf, string, object} = React.PropTypes;

export const TravelFilteredPage = connectToStores(class extends React.Component {
  static displayName = 'TravelFilteredPage';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired,
    routingProps: object,
    intl: object.isRequired
  };

  static propTypes = {
    recentGrabs: arrayOf(GrabShape).isRequired,
    currentUser: UserShape.isRequired,
    itinerarySubscription: ItinerarySubscriptionShape,
    from: LocationShape,
    to: CityShape,
    fromId: string,
    toId: string,
    params: object
  };

  constructor(props) {
    super(props);
    this.state = {showSubscription: true};
  }

  componentWillMount() {
    this.paginator = new Paginator(this.context, {
      pageSize: 20,
      storeName: RecentGrabsStore.storeName,
      action: loadRecentGrabs
    });

    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    const {fromId, toId} = this.props.params;
    this.loadData(fromId, toId);
  }

  componentDidMount() {
    const {fromId, toId} = this.props.params;
    window.scrollTo(0, 0);
    mixpanelPageViewTravel();
    this.trackPageView(fromId, toId);
  }

  componentWillReceiveProps(newProps) {
    const {fromId: oldFromId, toId: oldToId} = this.props.params;
    const {fromId: newFromId, toId: newToId} = newProps.params;

    if (newFromId !== oldFromId || newToId !== oldToId) {
      this.unloadData();
      this.loadData(newFromId, newToId);
      this.trackPageView(newFromId, newToId);
    }
  }

  trackPageView(fromId, toId) {
    if (fromId && toId) {
      trackPageView(this.context, {path: `/to/${toId}/from/${fromId}`});
    } else if (fromId) {
      trackPageView(this.context, {path: `/from/${fromId}`});
    } else if (toId) {
      trackPageView(this.context, {path: `/to/${toId}`});
    }
  }

  componentWillUnmount() {
    this.unloadData();
  }

  loadData = (fromId, toId) => {
    this.paginator.filters = {from: fromId, to: toId};

    if (fromId && (CLIENT || !this.context.getStore(CityStore).get(fromId).isLoaded())) {
      this.context.executeAction(loadCity, {id: fromId});
    }

    if (toId && (CLIENT || !this.context.getStore(CityStore).get(toId).isLoaded())) {
      this.context.executeAction(loadCity, {id: toId});
    }

    if (CLIENT || !this.context.getStore(RecentGrabsStore).isLoaded()) {
      this.paginator.reload();
    }
  };

  unloadData = () => {
    this.context.executeAction(context => {
      context.dispatch(Actions.UNLOAD_SEQUENCE, {sequenceName: RecentGrabsStore.sequenceName});
    });
  };

  navigate(from, to) {
    from = (from || {}).id;
    to = (to || {}).id;
    let url;
    if (isFinite(from) && isFinite(to)) {
      url = URI.expand('/travel/from{/from}/to{/to}', {from, to}).href();
    } else if (isFinite(from)) {
      url = URI.expand('/travel/from{/from}', {from}).href();
    } else if (isFinite(to)) {
      url = URI.expand('/travel/to{/to}', {to}).href();
    }
    if (url) {
      this.context.executeAction(pushHistoryState, [url]);
    }
  }

  showItinerarySubscription = () => {
    const {to, itinerarySubscription, currentUser} = this.props;
    const {showSubscription} = this.state;
    return showSubscription && !currentUser.isGuest && to && !itinerarySubscription;
  };

  subscribeToItinerary = () => {
    const subscriptionId = uuid.v4();
    const {fromId, toId} = this.props;

    this.context.executeAction(createSubscription, {
      id: subscriptionId,
      fromId, toId
    });
  };

  hideSubscription = () => {
    this.setState({showSubscription: false});
  };

  render() {
    const {recentGrabs, currentUser} = this.props;
    const {from, to} = this.props;
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
        <div className="min-h-100 flex-col">
          <NavigationBar/>
          <div className="flex-grow travel m-xs-b-3">

            {this.showItinerarySubscription() && <div className="travel__popup">
              <div className="container">
                <div className="row">
                  <div className="col-xs-12 col-lg-10 offset-lg-1">
                    <div className="travel__popup-body">
                      <div className="travel__popup-message m-xs-a-1 m-md-x-0">
                        <a href="#" className="pull-xs-right hidden-md-up p-xs-l-1" onClick={this.hideSubscription}>
                          <TimesIcon />
                        </a>
                        <h5><FormattedMessage id="pages.travel.itinerary_title"/></h5>
                        <div className="text-small">
                          <FormattedMessage id="pages.travel.itinerary_lead"/>
                        </div>
                      </div>
                      <div className="travel__popup-btn m-xs-x-1 m-xs-b-1 m-md-b-0">
                        <button type="button" className="btn btn-block btn-primary" onClick={this.subscribeToItinerary}>
                          <FormattedMessage id="pages.travel.itinerary_label"/>
                        </button>
                      </div>
                      <div className="travel__popup-close hidden-sm-down">
                        <button type="button" className="btn btn-link" onClick={this.hideSubscription}>
                          <TimesIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}

            <div className="travel__filter p-xs-a-1">

              <div className="d-block text-emphasis text-xs-center m-b-1 m-x-1 travel__title-white">
                <FormattedMessage id="pages.travel.filter"/>
              </div>

              <div className="container">
                <div className="row">
                  <div className="col-xs-12 col-lg-10 offset-lg-1">
                    <div className="travel__banner-form">

                      <div className="form-control travel__banner-input">
                        <div className={'text-muted travel__banner-input-label m-xs-r-space ' +
                                        (from ? '' : 'hidden-xs-up')}>
                          <FormattedMessage id="pages.travel.from"/>
                        </div>
                        <GrabFormFrom onChange={from => {
                          this.navigate(shapeLocation(from), to);
                        }} onRemove={() => {
                          this.navigate(null, to);
                        }} value={from} query={name(from)} placeholderKey="pages.travel.from_placeholder"/>
                      </div>
                      <div className="form-control travel__banner-input">
                        <div className={'text-muted travel__banner-input-label m-xs-r-space ' +
                                        (to ? '' : 'hidden-xs-up')}>
                          <FormattedMessage id="pages.travel.to"/>
                        </div>
                        <GrabFormTo onChange={to => {
                          this.navigate(from, shapeCity(to));
                        }} onRemove={() => {
                          this.navigate(from, null);
                        }} value={to} query={name(to)} placeholderKey="pages.travel.to_placeholder"/>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
            <div className="container">
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
}, [RecentGrabsStore, ItinerarySubscriptionStore, CityStore], ({getStore}, {params: {fromId, toId}}) => {
  fromId = Number(fromId);
  toId = Number(toId);
  let from;
  if (getStore(CityStore).has(fromId)) {
    from = getStore(CityStore).get(fromId);
  } else {
    from = getStore(CountryStore).get(fromId);
  }
  return {
    recentGrabs: getStore(RecentGrabsStore).get().map(shapeGrab),
    currentUser: shapeUser(getStore(AccountStore).getUser()),
    from: shapeLocation(from),
    to: shapeLocation(getStore(CityStore).get(toId)),
    itinerarySubscription: shapeItinerarySubscription(
      getStore(ItinerarySubscriptionStore).getByItinerary({fromId, toId})
    )
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/travel/TravelFilteredPage.js