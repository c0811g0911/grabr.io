import React from 'react';

const {bool, number, oneOf, oneOfType, shape, string} = React.PropTypes;

export function shapeUser(user) {
  if (!user) return null;

  return {
    avatarUrl: user.get('avatar') ? user.get('avatar').get('url') : user.get('avatar_url') || null,
    consumerRating: user.get('consumer_rating'),
    consumerRatingCount: user.get('consumer_rating_count'),
    email: user.getEmail() || null,
    firstName: user.get('first_name'),
    fullName: user.getFullName(),
    isEmailConfirmed: user.get('email') && user.get('email').confirmed,
    grabberRating: user.get('grabber_rating'),
    grabberRatingCount: user.get('grabber_rating_count'),
    id: user.get('id'),
    isAdmin: user.isAdmin(),
    isBlocked: user.isBlocked(),
    isGuest: user.isGuest(),
    lastName: user.get('last_name'),
    type: user.get('type')
  };
}

export function isUser({type}) {
  return type === 'users';
}

export function isSameUser($1, $2) {
  return isUser($1) && isUser($2) && $1.id === $2.id;
}

export const UserShape = shape({
  avatarUrl: string,
  consumerRating: number,
  consumerRatingCount: number,
  email: string,
  isEmailConfirmed: bool,
  firstName: string,
  fullName: string,
  grabberRating: number,
  grabberRatingCount: number,
  id: oneOfType([number, string]).isRequired,
  isAdmin: bool,
  isBlocked: bool,
  isGuest: bool,
  lastName: string,
  type: oneOf(['users', 'user']).isRequired
});



// WEBPACK FOOTER //
// ./src/main/app/models/UserModel.js