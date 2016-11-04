import React from 'react';
import {CollectionListShape, shapeCollectionList} from './CollectionModel';
import {LocationShape, shapeLocation} from './LocationModel';
import {shapeTagList, TagListShape} from './TagModel';
import {LocaleShape} from './LocaleModel';
import {isArray} from 'lodash';

const {arrayOf, bool, number, oneOf, shape, string} = React.PropTypes;

export function shapeItem(item) {
  if (item) {
    let imageUrls;
    if (item.get('images')) {
      imageUrls = item.get('images').map(image => image.get('url'));
    } else {
      imageUrls = item.get('image_urls');
    }

    return {
      collectionId: (item.get('collections') || []).length > 0 ? item.get('collections')[0].get('id') : null,
      collections: shapeCollectionList(item.get('collections')),
      description: item.get('description'),
      featured: Boolean(item.get('featured')),
      from: shapeLocation(item.get('from')),
      fromShop: Boolean(item.isFromShop()),
      id: item.get('id'),
      imageUrl: imageUrls && imageUrls[0],
      imageUrls,
      lead: item.get('lead'),
      price: item.get('estimate_price_cents') / 100,
      priceCurrency: item.get('estimate_price_currency'),
      shopUrl: item.get('shop_url'),
      tags: shapeTagList(item.get('tags')),
      title: item.get('title'),
      type: item.get('type'),
      properties: isArray(item.get('properties')) ? item.get('properties') : []
    };
  }
}

export const ItemShape = shape({
  collectionId: number,
  collections: CollectionListShape.isRequired,
  description: string.isRequired,
  featured: bool.isRequired,
  from: LocationShape,
  fromShop: bool.isRequired,
  id: number.isRequired,
  imageUrl: string,
  lead: LocaleShape,
  price: number.isRequired,
  priceCurrency: string.isRequired,
  shopUrl: string,
  tags: TagListShape.isRequired,
  title: string.isRequired,
  type: oneOf(['item', 'items']).isRequired,
  properties: arrayOf(shape({
    label: LocaleShape.isRequired,
    placeholder: LocaleShape.isRequired,
    value: string
  }))
});



// WEBPACK FOOTER //
// ./src/main/app/models/ItemModel.js