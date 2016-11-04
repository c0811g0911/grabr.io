import {AccountStore} from '../../stores/AccountStore';
import {connectToStores} from 'fluxible-addons-react';
import {Messenger} from '../../components/_messenger/Messenger';
import React from 'react';
import {ConversationShape, shapeConversation} from '../../models/ConversationModel';
import {ConversationStore, MessageStore} from '../../stores/DataStores';
import {shapeUser, UserShape} from '../../models/UserModel';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Page, Head, Body} from '../../Page';
import {loadConversation} from '../../actions/MessageActionCreators';
import {Actions} from '../../actions/Constants';
import {Alerts} from '../../components/_alerts/Alerts';
import {trackPageView} from '../../utils/trackPageView';
import {intercomHide, intercomShow} from '../../utils/IntercomUtils';

const {func, object, bool} = React.PropTypes;

export const ConversationPage = connectToStores(class extends React.Component {
  static displayName = 'ConversationPage';

  static propTypes = {
    conversation: ConversationShape.isRequired,
    currentUser: UserShape.isRequired,
    isConversationLoaded: bool,
    params: object.isRequired
  };

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired,
    routingProps: object.isRequired
  };

  componentWillMount() {
    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    const {params: {id}, isConversationLoaded} = this.props;

    if (CLIENT || !isConversationLoaded) {
      this.context.executeAction(loadConversation, {id});
    }
  }

  componentDidMount() {
    const {params: {id}} = this.props;

    window.scrollTo(0, 0);
    intercomHide();
    trackPageView(this.context, {path: `/conversations/${id}`});
  }

  componentWillUnmount() {
    intercomShow();
  }

  render() {
    const {conversation, currentUser, isConversationLoaded} = this.props;
    return (
      <Page>
        <Head>
        </Head>
        <Body>
          <div className="min-h-100 flex-col">
            <NavigationBar/>
            <div className="flex-col flex-grow container-fluid w-100 m-md-t-2">
              <div className="row flex-grow">
                <div className="flex-col flex-grow col-xs-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 p-a-0">
                  <If condition={isConversationLoaded}>
                    <Messenger conversation={conversation} currentUser={currentUser}/>
                  </If>
                </div>
              </div>
            </div>
            <Alerts />
          </div>
        </Body>
      </Page>
    );
  }
}, [ConversationStore, MessageStore, AccountStore], ({getStore}, {params: {id}}) => ({
  conversation: shapeConversation(getStore(ConversationStore).get(id)),
  isConversationLoaded: getStore(ConversationStore).get(id).isLoaded(),
  currentUser: shapeUser(getStore(AccountStore).getUser())
}));



// WEBPACK FOOTER //
// ./src/main/app/pages/_conversation/ConversationPage.js