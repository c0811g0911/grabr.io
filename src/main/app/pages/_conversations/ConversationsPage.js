import classNames from 'classnames';
import {InfiniteScroll} from '../../components/_infinite-scroll/InfiniteScroll';
import {Paginator} from '../../utils/Paginator';
import React from 'react';
import {AccountStore} from '../../stores/AccountStore';
import {connectToStores} from 'fluxible-addons-react';
import {ConversationPreview} from '../../components/_conversation-preview/ConversationPreview';
import {ConversationShape, getOpposingMember, shapeConversation} from '../../models/ConversationModel';
import {ConversationStore} from '../../stores/DataStores';
import {FormattedMessage} from 'react-intl';
import {loadMyConversations} from '../../actions/MessageActionCreators';
import {MyConversationListStore} from '../../stores/SequenceStores';
import {shapeUser, UserShape} from '../../models/UserModel';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Page, Head, Body} from '../../Page';
import {AppStore} from '../../stores/AppStore';
import {Actions} from '../../actions/Constants';
import {Alerts} from '../../components/_alerts/Alerts';
import {trackPageView} from '../../utils/trackPageView';

const {arrayOf, func, object} = React.PropTypes;

export const ConversationsPage = connectToStores(class extends React.Component {
  static displayName = 'ConversationsPage';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired,
    routingProps: object,
    intl: object.isRequired
  };

  static propTypes = {
    conversationList: arrayOf(ConversationShape).isRequired,
    currentUser: UserShape.isRequired
  };

  componentWillMount() {
    this.paginator = new Paginator(this.context, {
      pageSize: 10,
      storeName: MyConversationListStore.storeName,
      action: loadMyConversations
    });

    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    if (CLIENT || !this.context.getStore(MyConversationListStore).isLoaded()) {
      this.paginator.reload();
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/conversations`});
  }

  //componentWillUnmount() {
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_SEQUENCE, {sequenceName: MyConversationListStore.sequenceName});
  //  });
  //}

  render() {
    const {paginator} = this;
    const {conversationList, currentUser} = this.props;

    let conversationListBlock;

    if (this.context.getStore(MyConversationListStore).isLoaded()) {
      conversationListBlock = (
        <div className="grabr-placeholder">
          <span className="icon--legacy-messages"/>
          <FormattedMessage id="pages.conversations.placeholder"/>
        </div>
      );
    }

    if (conversationList.length > 0) {
      conversationListBlock = conversationList.filter(({lastMessage}) => Boolean(lastMessage)).map((conversation, i) => {
        const {locked, unreadMessagesCount} = conversation;
        const opposingUser = getOpposingMember(conversation, currentUser);
        const unread = unreadMessagesCount > 0;
        return (
          <li key={i} className={classNames('grabr-row', {unread, locked})}>
            <ConversationPreview conversation={conversation} opposingUser={opposingUser}/>
          </li>
        );
      });
    }

    return  (
      <Page>
        <Head>
          <title>{this.context.intl.formatMessage({id: 'pages.conversations.document_title'})}</title>
        </Head>
        <Body>
          <div className="min-h-100 flex-col">
            <NavigationBar/>
            <div className="container-fluid w-100 m-md-b-3 m-t-2">
              <h1 className="text-center font-size-xl m-b-2">
                <FormattedMessage id="pages.conversations.page_header"/>
              </h1>
              <div className="row">
                <div className="col-xs-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2
                                  panel panel--xs-top-rounded panel--xs-bottom-rounded text-black p-a-0"
                >
                  <InfiniteScroll
                    wrapper="ul"
                    className="m-b-0"
                    hasMore={paginator.hasMore()}
                    isSyncing={paginator.isSyncing()}
                    onScroll={() => {paginator.loadMore();}}
                  >
                    {conversationListBlock}
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
}, [ConversationStore, MyConversationListStore], ({getStore}) => {
  return {
    conversationList: getStore(MyConversationListStore).get().map(shapeConversation),
    currentUser: shapeUser(getStore(AccountStore).getUser())
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/_conversations/ConversationsPage.js