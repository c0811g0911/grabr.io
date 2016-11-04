import {Actions} from '../actions/Constants';
import moment from 'moment';
import uuid from 'node-uuid';
import {AccountStore} from '../stores/AccountStore';
import {ConversationStore, GrabStore, MessageStore} from '../stores/DataStores';
import {LocalStore} from '../stores/LocalStore';
import {makeAuthorizedRequest, makePaginatedRequest} from '../utils/ActionUtils';
import {MyConversationListStore} from '../stores/SequenceStores';
import {shapeConversation} from '../models/ConversationModel';
import {shapeGrab} from '../models/GrabModel';
import {subscribeMessageBus} from '../utils/APIUtils';
import URI from 'urijs';
import {AppStore} from '../stores/AppStore';

async function sendMessage(context, payload) {
  const {dispatch, getStore} = context;
  const {body, conversationId, id, imageId} = payload;
  const conversation = getStore(ConversationStore).get(conversationId);
  const {grab: {id: grabId}, title, temp} = shapeConversation(conversation);

  if (temp) {
    const {body: json} = await createConversation(context, {body, grabId});
    const {conversation} = json;
    const url = URI.expand('/conversations{/id}', {id: conversation.id}).href();
    conversation.temp = false;
    history.replaceState({}, title, url);
    return dispatch(Actions.UPDATE_INSTANCE, {json, id: conversationId});
  }

  try {
    const {body: json} = await createMessage(context, {body, conversationId, imageId});
    return dispatch(Actions.UPDATE_INSTANCE, {id, json});
  } catch (error) {
    return dispatch(Actions.CREATE_FAILURE, {id, type: 'messages', errors: error.errors});
  }

  async function createConversation(context, payload) {
    const {body, grabId} = payload;
    const endpoint = URI.expand('/grabs{/grabId}/conversations', {grabId}).href();
    const query = {conversation: {messages: [{body}]}};
    const options = {query, version: 2};
    return await makeAuthorizedRequest('post', endpoint, options, context);
  }

  async function createMessage(context, payload) {
    const {body, conversationId, imageId} = payload;
    const endpoint = URI.expand('/conversations{/conversationId}/messages', {conversationId}).href();
    let query;
    if (imageId) {
      query = {message: {body, image: {id: imageId}}};
    } else {
      query = {message: {body}};
    }
    const options = {query, version: 2};
    return await makeAuthorizedRequest('post', endpoint, options, context);
  }
}

export async function loadMyConversations(context, payload) {
  const {append, pageNumber, pageSize} = payload;
  const endpoint = '/conversations';
  const options = {
    append,
    pageNumber,
    pageSize,
    sequenceName: MyConversationListStore.sequenceName,
    version: 2
  };
  return await makePaginatedRequest(context, endpoint, options);
}

export async function loadConversation(context, payload) {
  const {id} = payload;
  return await Promise.all([readConversation(context, {id}), readMessageList(context, {id})]);

  async function readConversation(context, payload) {
    const {dispatch} = context;
    const {id} = payload;
    const endpoint = URI.expand('/conversations{/id}', {id}).href();
    const options = {version: 2};
    const {body: json} = await makeAuthorizedRequest('get', endpoint, options, context);
    dispatch(Actions.LOAD_DATA_SUCCESS, {json});
    return dispatch(Actions.LOAD_DATA_ITEM, {id, storeName: ConversationStore.storeName});
  }

  async function readMessageList(context, payload) {
    const {dispatch} = context;
    const {id} = payload;
    const rIO = {rootId: id, rootType: ConversationStore.type};
    const endpoint = URI.expand('/conversations{/id}/messages', {id}).href();
    const options = {version: 2};
    const {body: json} = await makeAuthorizedRequest('get', endpoint, options, context);
    return dispatch(Actions.LOAD_INCLUDED_SUCCESS, {json, ...rIO});
  }
}

export async function createConversation(context, payload) {
  const {dispatch, getStore} = context;
  const {grabId} = payload;
  const conversationId = uuid.v4();
  const currentUser = getStore(AccountStore).getUser();
  {
    const endpoint = URI.expand('/grabs{/grabId}', {grabId}).href();
    const options = {version: 2};
    const {body: json} = await makeAuthorizedRequest('get', endpoint, options, context);
    dispatch(Actions.LOAD_DATA_SUCCESS, {json});
    dispatch(Actions.LOAD_DATA_ITEM, {id: grabId, storeName: GrabStore.storeName});
  }
  const grab = shapeGrab(getStore(GrabStore).get(grabId));
  return dispatch(Actions.LOAD_DATA_SUCCESS, {
    json: {
      grab: {
        conversation_id: conversationId,
        id: grab.id,
        type: GrabStore.type
      },
      included: {
        conversations: [
          {
            consumer_id: grab.consumer.id,
            grab_id: grab.id,
            grabber_id: currentUser.id,
            id: conversationId,
            messages_ids: [],
            temp: true,
            title: grab.title,
            type: ConversationStore.type
          }
        ]
      }
    }
  });
}

export async function createMessage(context, {body, conversationId, imageId}) {
  const id = uuid.v4();

  context.dispatch(Actions.CREATE_START, {
    id, type: 'message', json: {
      id,
      body,
      sender_id: context.getStore(AccountStore).getUser().get('id'),
      read: null,
      created: moment().format()
    }
  });
  context.dispatch(Actions.ADD_TO_RELATION, {
    id: conversationId,
    type: 'conversation',
    relation: 'messages',
    objectId: id
  });

  return await sendMessage(context, {body, conversationId, id, imageId});
}

export async function deleteMessage(context, {conversationId, id}) {
  context.dispatch(Actions.REMOVE_MESSAGE, {id, conversationId});
}

export async function resendMessage(context, {body, conversationId, id}) {
  return await sendMessage(context, {body, conversationId, id});
}

export async function markConversationAsRead(context, payload) {
  const {dispatch} = context;
  const {id} = payload;
  const endpoint = URI.expand('/conversations{/id}/read', {id}).href();
  const options = {version: 2};
  dispatch(Actions.MARK_CONVERSATION_AS_READ, {id});
  const {body: {unread_conversations_count}} = await makeAuthorizedRequest('post', endpoint, options, context);
  return dispatch(Actions.CHANGE_COUNT, {counters: {unread_conversations_count}});
}

export async function startPolling(context, {}) {
  const authToken = context.getStore(LocalStore).get('AUTH_TOKEN');
  const {config: {apiRoot}} = context.getStore(AppStore).getState();
  if (!authToken) {
    return;
  }

  subscribeMessageBus('/messages', function (json) {
    if (!json || !json.message) {
      return;
    }

    context.dispatch(Actions.LOAD_POLLED_MESSAGE, {json});

    const message = context.getStore(MessageStore).get(json.message.id);
    const currentUser = context.getStore(AccountStore).getUser();
    const currentPath = window.location.pathname;
    const isSenderCurrentUser = message.get('sender').get('id') === currentUser.get('id');
    const isCurrentRouteConversation = currentPath === `/conversations/${message.get('conversation').get('id')}`;

    if (!isSenderCurrentUser && !isCurrentRouteConversation) {
      context.dispatch(Actions.SHOW_ALERT, {data: json});
    }

    context.dispatch(Actions.CHANGE_COUNT, {
      counters: {
        unread_conversations_count: json.message.unread_conversations_count
      }
    });
  }, authToken, apiRoot);
}



// WEBPACK FOOTER //
// ./src/main/app/actions/MessageActionCreators.js