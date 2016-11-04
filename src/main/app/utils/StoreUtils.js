import pluralize from 'pluralize';
import * as _ from 'lodash';

export function getType(type) {
  return pluralize.plural({
    from: 'city',
    to: 'city',
    consumer: 'user',
    grabber: 'user',
    sender: 'user',
    receiver: 'user',
    last_message: 'message',
    accepted_offer: 'offer',
    accepted_grabber: 'user',
    reviewer: 'user',
    reviewee: 'user',
    consumer_reviews: 'review',
    traveler_reviews: 'review',
    grab_transitions: 'grab_transition',
    avatar: 'image',
    previous_images: 'image',
    image_url: 'image',
    target_location: 'country'
  }[type] || type);
}

export function isId(name) {
  return name != 'file_id' && /.*_id$/.test(name);
}

export function isIds(name) {
  return (/.*_ids$/.test(name)
  );
}

export function isObject(value) {
  return _.isObject(value) && !_.isArray(value) && (value.id || value.type) &&
         ['emails', 'bank_accounts', 'phones'].indexOf(value.type) === -1;
}

export function isObjectArray(value) {
  return _.isArray(value) && value.every(item => item.id);
}

export function isAttribute(name, value) {
  return !(isId(name) || isIds(name) || isObject(value) || isObjectArray(value));
}

export function getStoreClass(type) {
  type = pluralize.singular(type);
  const formattedType = _.upperFirst(_.camelCase(type));

  return formattedType + 'Store';
}

export function getSequenceClass(name) {
  return _.camelCase(`A_${ name }_STORE`).slice(1);
}



// WEBPACK FOOTER //
// ./src/main/app/utils/StoreUtils.js