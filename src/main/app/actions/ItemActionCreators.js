import {Actions} from '../actions/Constants';
import _ from 'lodash';
import {handleError} from '../utils/handleError';
import {makeAuthorizedRequest, makePaginatedRequest} from '../utils/ActionUtils';
import {uploadImage2} from './ImageActionCreators';
import {SimilarItemsStore, ItemCategoriesStore, TopItemsStore} from '../stores/SequenceStores';
import {ItemStore} from '../stores/DataStores';
import {pushHistoryState} from './HistoryActionCreators';

export function loadTopItems(context, {count}) {
  return makePaginatedRequest(context, '/items', {
    pageNumber: 0, pageSize: count, version: 2,
    sequenceName: TopItemsStore.sequenceName,
    query: {'filter[featured]': true}
  });
}

export function loadSimilarItems(context, {count, collectionId}) {
  return makePaginatedRequest(context, '/items', {
    pageNumber: 0, pageSize: count,
    sequenceName: SimilarItemsStore.sequenceName,
    version: 2,
    query: {filter: {collection_id: collectionId}}
  });
}

export function createItem(context, {id, attributes, update = false}) {
  attributes.image_file_ids = attributes.images.map(image => image.get('file_id') || image.get('id'));
  attributes = _.omit(attributes, 'images');

  attributes.published = attributes.published || false;

  const prefix = update ? 'UPDATE' : 'CREATE';

  let url = '/admin/items';
  if (update) {
    url += `/${ id }`;
  }
  const method = update ? 'patch' : 'post';

  if (attributes.from) {
    attributes.from_id = attributes.from.value || attributes.from.get('id');
    delete attributes.from;
  }

  const {collections, tags} = attributes;

  if (collections) {
    attributes.collection_ids = collections.map(col => col.id);
  }

  if (tags) {
    attributes.tag_ids = tags.map(tag => tag.id);
  }

  context.dispatch(Actions[`${ prefix }_START`], {id, type: 'item'});

  return makeAuthorizedRequest(method, url, {query: {item: attributes}, version: 2}, context).then(res => {
    context.dispatch(Actions[`${ prefix }_SUCCESS`], {id, type: 'item', json: res.body});
    context.executeAction(pushHistoryState, ['/admin/items']);
  }).catch(err => {
    handleError(err, context, {
      action: Actions[`${ prefix }_FAILURE`],
      actionOptions: {id, type: 'item'}
    });
  });
}

export function loadItem(context, {id}) {
  return makeAuthorizedRequest('get', `/items/${ id }`, {version: 2}, context).then(res => {
    context.dispatch(Actions.LOAD_DATA_SUCCESS, {json: res.body});
    context.dispatch(Actions.LOAD_DATA_ITEM, {id, storeName: ItemStore.storeName});

    context.dispatch(Actions.LOAD_SEQUENCE_SUCCESS, {
      json: res.body.meta,
      sequenceName: ItemCategoriesStore.sequenceName
    });
  });
}

export function getItemFromUrl(context, {url}, done) {
  context.dispatch(Actions.START_SYNC);

  makeAuthorizedRequest('post', '/items/url', {query: {url}, version: 2}, context).then(res => {
    const json = res.body;
    const item = json.item;

    context.dispatch(Actions.FINISH_SYNC);

    if (!json.errors && !!item.title) {
      context.dispatch(Actions.UPDATE_ATTRIBUTES, {
        title: item.title.substr(0, 70),
        description: item.description.substr(0, 1000),
        estimate_price_cents: item.estimate_price_cents,
        shop_url: item.shop_url,
        images: []
      });
      item.image_urls.forEach(url => {
        context.executeAction(uploadImage2, {
          url, multiple: true
        });
      });
    } else {
      context.dispatch(Actions.OPEN_ERROR_MODAL, {error: 'broken_item_url'});
    }
    done();
  });
}



// WEBPACK FOOTER //
// ./src/main/app/actions/ItemActionCreators.js