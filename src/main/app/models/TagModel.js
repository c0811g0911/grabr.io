import React from 'react';
import {LocaleShape, shapeLocale} from './LocaleModel';

const {arrayOf, number, oneOf, shape, string} = React.PropTypes;

export function shapeTag(tag) {
  if (tag) {
    return {
      id: tag.get('id'),
      imageUrl: tag.get('image_url'),
      title: shapeLocale(tag.get('title')),
      type: tag.get('type')
    };
  }
}

export function shapeTagList(tagList) {
  return (tagList || []).map(shapeTag).filter(isTag);
}

export function isTag(any) {
  if (!any) {
    return false;
  }
  return any.type === 'tag' || any.type === 'tags';
}

export function isSameTag($1, $2) {
  return isTag($1) && isTag($2) && $1.id === $2.id;
}

export const TagShape = shape({
  id: number.isRequired,
  imageUrl: string,
  title: LocaleShape.isRequired,
  type: oneOf(['tag', 'tags']).isRequired
});

export const TagListShape = arrayOf(TagShape);



// WEBPACK FOOTER //
// ./src/main/app/models/TagModel.js