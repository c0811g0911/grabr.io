import React from 'react';
import {GrabShape, shapeGrab} from './GrabModel';
import {isSameUser, shapeUser, UserShape} from './UserModel';
import {MessageShape, shapeMessage} from './MessageModel';

const {arrayOf, bool, number, oneOf, oneOfType, shape, string} = React.PropTypes;

export function shapeConversation(conversation) {
  if (conversation) {
    return {
      consumer: conversation.get('consumer') ? shapeUser(conversation.get('consumer')) : {},
      grab: shapeGrab(conversation.get('grab')),
      grabber: conversation.get('grabber') ? shapeUser(conversation.get('grabber')) : {},
      id: conversation.get('id'),
      lastMessage: conversation.get('last_message') ? shapeMessage(conversation.get('last_message')) : null,
      locked: conversation.get('locked'),
      messages: conversation.get('messages').map(shapeMessage),
      title: conversation.get('title'),
      temp: conversation.get('temp') || false,
      type: conversation.get('type'),
      unreadMessagesCount: conversation.get('unread_messages_count')
    };
  }
}

export function isConversation({type}) {
  return type === 'conversations';
}

export function getOpposingMember(conversation, currentUser) {
  const {consumer, grabber} = conversation;
  if (isSameUser(grabber, currentUser)) {
    return consumer;
  }
  return grabber;
}

export const ConversationShape = shape({
  consumer: UserShape,
  grab: GrabShape,
  conversationalist: UserShape,
  id: oneOfType([number, string]).isRequired,
  lastMessage: MessageShape,
  locked: bool,
  messages: arrayOf(MessageShape),
  title: string,
  temp: bool.isRequired,
  type: oneOf(['conversation', 'conversations']).isRequired,
  unreadMessagesCount: number.isRequired
});



// WEBPACK FOOTER //
// ./src/main/app/models/ConversationModel.js