import React, {PropTypes} from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NotificationPreview} from '../../components/_notification-preview/NotificationPreview';
import {InfiniteScroll} from '../../components/_infinite-scroll/InfiniteScroll';
import {markAllNotificationsAsRead, loadMyNotifications} from '../../actions/NotificationActionCreators';
import {FormattedMessage} from 'react-intl';
import {Paginator} from '../../utils/Paginator';
import {MyNotificationsStore} from '../../stores/SequenceStores';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Page, Head, Body} from '../../Page';
import {AppStore} from '../../stores/AppStore';
import {Actions} from '../../actions/Constants';
import {Alerts} from '../../components/_alerts/Alerts';
import {trackPageView} from '../../utils/trackPageView';

export const NotificationsPage = connectToStores(class extends React.Component {
  static displayName = 'NotificationsPage';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
    routingProps: PropTypes.object,
    intl: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.paginator = new Paginator(this.context, {
      pageSize: 10,
      storeName: 'MyNotificationsStore',
      action: loadMyNotifications
    });

    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    if (CLIENT || !this.context.getStore(MyNotificationsStore).isLoaded()) {
      this.paginator.reload();
    }
  }

  //componentWillUnmount() {
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_SEQUENCE, {sequenceName: MyNotificationsStore.sequenceName});
  //  });
  //}

  componentDidMount() {
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/notifications`});
    setTimeout(() => {
      this.markAsRead();
    }, 500);
  }

  handleLoadMore() {
    this.paginator.loadMore();
  }

  markAsRead() {
    this.context.executeAction(markAllNotificationsAsRead);
  }

  renderNotifications() {
    if (this.props.notifications.length > 0) {
      return this.props.notifications.map(notification => {
        return <NotificationPreview key={notification.get('id')} notification={notification} withRow={true}/>;
      });
    } else if (this.context.getStore(MyNotificationsStore).isLoaded()) {
      return (
        <div className="grabr-placeholder">
          <span className="icon--legacy-notifications"/>
          <FormattedMessage id="pages.notifications.placeholder"/>
        </div>
      );
    }
  }

  render() {
    return (
      <Page>
        <Head>
          <title>{this.context.intl.formatMessage({id: 'pages.notifications.document_title'})}</title>
        </Head>
        <Body>
          <div className="min-h-100 flex-col">
            <NavigationBar/>
            <div className="container-fluid w-100 m-md-b-3 m-t-2">
              <h1 className="text-center font-size-xl m-b-2">
                <FormattedMessage id="pages.notifications.page_header"/>
              </h1>
              <div className="row">
                <div className="col-xs-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2
                                panel panel--xs-top-rounded panel--xs-bottom-rounded text-black p-a-0"
                >
                  <InfiniteScroll
                    wrapper="ul"
                    className="m-b-0"
                    hasMore={this.paginator.hasMore()}
                    isSyncing={this.paginator.isSyncing()}
                    onScroll={this.handleLoadMore.bind(this)}
                  >
                    {this.renderNotifications()}
                  </InfiniteScroll>
                </div>
              </div>
            </div>
            <Alerts />
          </div>
        </Body>
      </Page>
    );
  }

}, [MyNotificationsStore], ({getStore}) => {
  return {
    notifications: getStore(MyNotificationsStore).get()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/_notifications/NotificationsPage.js