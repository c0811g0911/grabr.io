import React from 'react';
import {shapeUser, UserShape} from './UserModel';

const {bool, number, oneOf, oneOfType, shape, string} = React.PropTypes;

export function shapeMessage(message) {
  if (message) {
    return {
      body: message.get('body') || '',
      created: message.get('created'),
      id: message.get('id'),
      imageUrl: message.get('image') ? message.get('image').get('url') : null,
      conversationId: message.get('conversation') && message.get('conversation').get('id'),
      isSyncFailed: message.isSyncFailed,
      isSyncing: message.isSyncing,
      read: message.get('read'),
      receiver: message.get('receiver') ? shapeUser(message.get('receiver')) : null,
      seen: message.get('seen'),
      sender: shapeUser(message.get('sender')),
      type: message.get('type')
    };
  }
}

export function isMessage(any) {
  if (!any) {
    return false;
  }
  return any.type === 'message' || any.type === 'messages';
}

export function isSameMessage($1, $2) {
  return isMessage($1) && isMessage($2) && $1.id === $2.id;
}

export const MessageShape = shape({
  body: string.isRequired,
  created: string.isRequired,
  id: oneOfType([number, string]).isRequired,
  conversationId: oneOfType([number, string]),
  imageUrl: string,
  isSyncFailed: bool.isRequired,
  isSyncing: bool.isRequired,
  read: string,
  receiver: UserShape,
  seen: string,
  sender: UserShape.isRequired,
  type: oneOf(['message', 'messages']).isRequired
});



// WEBPACK FOOTER //
// ./src/main/app/models/MessageModel.js