import {Actions} from '../actions/Constants';
import {FormStore} from '../stores/FormStore';
import {makeAuthorizedRequest} from '../utils/ActionUtils';

export async function uploadImage(context, {id, parent, file, url, property, multiple = false}, done) {
  if (file || url) {
    const {dispatch} = context;
    const endpoint = '/images';
    const params = {
      query: file ? {file} : {url},
      version: 2,
      ...(file ? {type: 'form'} : {})
    };

    try {
      dispatch(Actions.CREATE_START, {id, type: 'images'});
      const {body: json} = await makeAuthorizedRequest('post', endpoint, params, context);
      json.image.id = id;
      if (parent) {
        dispatch(Actions.ADD_TO_RELATION, {
          id: parent.id,
          type: parent.type,
          relation: property || (multiple ? 'images' : 'image'),
          objectId: id,
          multiple
        });
      }
      return dispatch(Actions.CREATE_SUCCESS, {id, type: 'image', json});
    } catch (error) {
      const {response: {body: {errors}}} = error;
      const {file: [message]} = errors;
      dispatch(Actions.OPEN_ERROR_MODAL, {error: 'image', message});
      return dispatch(Actions.CREATE_FAILURE, {id, type: 'image', errors});
    }
  }
}

export function removeImage({dispatch}, {id, parent}) {
  return dispatch(Actions.REMOVE_FROM_RELATION, {
    id: parent.id,
    type: parent.type,
    relation: 'images',
    objectId: id
  });
}

export async function uploadImage2(context, {file, url, property, multiple = false}) {
  function insertImageAtIndex(images, image, i) {
    return [...images.slice(0, i), image, ...images.slice(i + 1)];
  }

  property = property || (multiple ? 'images' : 'image');
  const {dispatch, getStore} = context;
  const images = getStore(FormStore).getAttributes()[property];

  if (file || url) {
    const endpoint = '/images';
    const options = {
      query: file ? {file} : {url},
      version: 2,
      ...(file ? {type: 'form'} : {})
    };

    try {
      dispatch(Actions.UPDATE_ATTRIBUTES, {[property]: images.concat({isSyncing: true})});
      const {body: {image}} = await makeAuthorizedRequest('post', endpoint, options, context);
      const imagesWithoutImage = getStore(FormStore).getAttributes()[property];
      const imagesWithImage = insertImageAtIndex(imagesWithoutImage, image, images.length);
      return dispatch(Actions.UPDATE_ATTRIBUTES, {[property]: imagesWithImage});
    } catch (error) {
      const {response: {body: {errors}}} = error;
      return dispatch(Actions.UPDATE_ERRORS, {[property]: errors});
    }
  }
}

export async function removeImage2({dispatch, getStore}, {index, property = 'images'}) {
  function removeImageAtIndex(images, i) {
    return [...images.slice(0, i), ...images.slice(i + 1)];
  }

  const imagesWithImage = getStore(FormStore).getAttributes()[property];
  const imagesWithoutImage = removeImageAtIndex(imagesWithImage, index);
  return await dispatch(Actions.UPDATE_ATTRIBUTES, {[property]: imagesWithoutImage});
}

export async function postImageAndGetId(context, {file}) {
  const endpoint = '/images';
  const options = {query: {file}, version: 2};
  const {body: {image: {'file_id': imageId}}} = await makeAuthorizedRequest('post', endpoint, options, context);
  return imageId;
}



// WEBPACK FOOTER //
// ./src/main/app/actions/ImageActionCreators.js