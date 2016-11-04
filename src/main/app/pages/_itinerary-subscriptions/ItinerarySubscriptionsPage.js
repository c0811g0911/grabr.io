import React, {PropTypes} from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {SyncButton} from '../../components/_sync-button/SyncButton';
import {unsubscribe} from '../../actions/ItineraryActionCreators';
import {FormattedMessage} from 'react-intl';
import {ItinerarySubscriptionStore} from '../../stores/DataStores';
import {MyItinerarySubscriptionsStore} from '../../stores/SequenceStores';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import {loadItinerarySubscriptions} from '../../actions/ItineraryActionCreators';
import {Actions} from '../../actions/Constants';
import {AppStore} from '../../stores/AppStore';
import {Alerts} from '../../components/_alerts/Alerts';
import {trackPageView} from '../../utils/trackPageView';

export const ItinerarySubscriptionsPage = connectToStores(class extends React.Component {
  static displayName = 'ItinerarySubscriptionsPage';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  componentWillMount() {
    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    if (CLIENT || !this.context.getStore(MyItinerarySubscriptionsStore).isLoaded()) {
      this.context.executeAction(loadItinerarySubscriptions);
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/settings/traveler-notifications`});
  }

  //componentWillUnmount() {
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_SEQUENCE, {sequenceName: MyItinerarySubscriptionsStore.sequenceName});
  //  });
  //}

  unsubscribe(id) {
    this.context.executeAction(unsubscribe, {id});
  }

  renderSubscriptions() {
    if (this.props.subscriptions.length > 0) {
      return this.props.subscriptions.map(subscription => {
        return <li key={subscription.get('id')} className="grabr-row">
          <article>
            <div>
              {subscription.getFrom()}
              {" — "}
              {subscription.getTo()}
            </div>
            <SyncButton className="transparent-button"
                        isDefaultButton={false}
                        isSyncing={subscription.isSyncing}
                        onClick={this.unsubscribe.bind(this, subscription.get('id'))}>
              Unfollow
            </SyncButton>
          </article>
        </li>;
      });
    } else {
      return <li className="grabr-row">
        <FormattedMessage id="pages.my_itinerary_subscriptions.placeholder"/>
      </li>;
    }
  }

  render() {
    return (
      <Page>
        <Head>
          <title>
            {this.context.intl.formatMessage({id: 'pages.my_itinerary_subscriptions.document_title'})}
          </title>
        </Head>
        <Body>
          <div className="min-h-100 flex-col">
            <NavigationBar/>
            <div className="container-fluid w-100 m-md-b-3 m-t-2">
              <h1 className="text-center font-size-xl m-b-2">
                <FormattedMessage id="pages.my_itinerary_subscriptions.page_header"/>
              </h1>
              <div className="row">
                <div className="col-xs-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2
                                        panel panel--legacy panel--xs-top-rounded panel--xs-bottom-rounded text-black p-a-0"
                >
                  <div className="grabr-list">
                    <ul>
                      {this.renderSubscriptions()}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
            <Alerts />
          </div>
        </Body>
      </Page>
    );
  }
}, [
  ItinerarySubscriptionStore,
  MyItinerarySubscriptionsStore
], ({getStore}) => {
  return {
    subscriptions: getStore(MyItinerarySubscriptionsStore).get()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/_itinerary-subscriptions/ItinerarySubscriptionsPage.js