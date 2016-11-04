import {AccountStore} from '../../stores/AccountStore';
import {connectToStores} from 'fluxible-addons-react';
import {ConversationShape, shapeConversation} from '../../models/ConversationModel';
import {ConversationStore, GrabStore, MessageStore} from '../../stores/DataStores';
import {Messenger} from '../../components/_messenger/Messenger';
import React from 'react';
import {shapeGrab} from '../../models/GrabModel';
import {UserShape, shapeUser} from '../../models/UserModel';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Page, Head, Body} from '../../Page';
import {createConversation} from '../../actions/MessageActionCreators';
import {Actions} from '../../actions/Constants';
import {Alerts} from '../../components/_alerts/Alerts';
import {trackPageView} from '../../utils/trackPageView';

const {func, object, bool} = React.PropTypes;

export const ConversationNewPage = connectToStores(class extends React.Component {
  static displayName = 'ConversationNewPage';

  static propTypes = {
    conversation: ConversationShape,
    currentUser: UserShape.isRequired,
    isGrabLoaded: bool,
    params: object.isRequired
  };

  static contextTypes = {
    getStore: func.isRequired,
    executeAction: func.isRequired
  };

  componentWillMount() {
    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    const {params: {grabId}, isGrabLoaded} = this.props;

    if (CLIENT || !isGrabLoaded) {
      this.context.executeAction(createConversation, {grabId});
    }
  }

  componentDidMount() {
    const {params: {grabId}} = this.props;

    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/grabs/${grabId}/conversations/new`});
  }

  //componentWillUnmount() {
  //  const {grabId} = this.props.params;
  //
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_DATA_ITEM, {id: grabId, storeName: GrabStore.storeName});
  //  });
  //}

  render() {
    const {conversation, currentUser, isGrabLoaded} = this.props;

    return (
      <Page>
        <Head></Head>
        <Body>
          <div className="h-100 flex-col">
            <NavigationBar/>
            <div className="flex-col flex-grow container-fluid w-100 m-md-t-2">
              <div className="row flex-grow">
                <div className="flex-grow col-xs-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 p-a-0">
                  <If condition={isGrabLoaded && conversation}>
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
  }å
}, [ConversationStore, MessageStore, AccountStore, GrabStore], ({getStore}, {params: {grabId}}) => {
  const {conversationId} = shapeGrab(getStore(GrabStore).get(grabId));
  const conversation = getStore(ConversationStore).get(conversationId);
  return {
    conversation: shapeConversation(conversation),
    isGrabLoaded: getStore(GrabStore).get(grabId).isLoaded(),
    currentUser: shapeUser(getStore(AccountStore).getUser())
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/_conversation-new/ConversationNewPage.js