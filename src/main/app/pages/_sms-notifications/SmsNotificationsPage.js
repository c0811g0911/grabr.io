import React from 'react';
import {makeAuthorizedRequest} from '../../utils/ActionUtils';
import {FormattedMessage} from 'react-intl';
import {Actions} from '../../actions/Constants';
import {connectToStores} from 'fluxible-addons-react';
import {AccountStore} from '../../stores/AccountStore';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import {AppStore} from '../../stores/AppStore';
import {loadAccount} from '../../actions/ProfileActionCreators';
import {UserStore} from '../../stores/DataStores';
import {Alerts} from '../../components/_alerts/Alerts';
import {trackPageView} from '../../utils/trackPageView';

const {func, object} = React.PropTypes;

export const SmsNotificationsPage = connectToStores(class extends React.Component {
  constructor(props) {
    super(props);
  }

  static contextTypes = {
    getStore: func.isRequired,
    executeAction: func.isRequired,
    intl: object.isRequired
  };

  componentWillMount() {
    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    if (CLIENT || !this.context.getStore(AccountStore).getUser().isLoaded()) {
      this.context.executeAction(loadAccount);
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/settings/sms-notifications`});
  }

  //componentWillUnmount() {
  //  const id = this.context.getStore(AccountStore).getUser().get('id');
  //
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_DATA_ITEM, {id, storeName: UserStore.storeName});
  //  });
  //}

  render() {
    return (
      <Page>
        <Head>
          <title>
            {this.context.intl.formatMessage({id: 'pages.sms_notifications.document_title'})}
          </title>
        </Head>
        <Body>
          <div className="min-h-100 flex-col">
            <NavigationBar/>
            <div className="flex-grow container-fluid w-100 m-md-b-3 m-t-2">
              <h1 className="text-center font-size-xl m-b-2">
                <FormattedMessage id="pages.sms_notifications.page_header"/>
              </h1>
              <div className="row">
                <div className="col-xs-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2
                                        panel panel--legacy panel--xs-top-rounded panel--xs-bottom-rounded text-black p-a-0"
                >
                  <form className="grabr-form">
                    <label className="grabr-input">
                      <input type="checkbox"
                             checked={this.props.account.getUser().get('allow_sms')}
                             onChange={({target: {checked}}) => {
                               this.context.executeAction(context => {
                                 makeAuthorizedRequest('patch', '/account/user', {
                                   version: 2,
                                   query: {user: {allow_sms: checked}}
                                 }, context).then(({body: {user}}) => {
                                   context.dispatch(Actions.UPDATE_ACCOUNT, {user});
                                 });
                               });
                             }}/>
                      <span><FormattedMessage id="pages.settings.sms_notifications"/></span>
                    </label>
                  </form>
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
}, [AccountStore], ({getStore}) => {
  return {
    account: getStore(AccountStore)
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/_sms-notifications/SmsNotificationsPage.js