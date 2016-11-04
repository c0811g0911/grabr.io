import {BaseStore} from 'fluxible/addons';
import {isId, isIds, isObject, isObjectArray, isAttribute, getStoreClass, getType} from '../utils/StoreUtils';
import {Actions} from '../actions/Constants';
import pluralize from 'pluralize';
import _ from 'lodash';

class Instance {
  constructor(id, store) {
    this._attributes = {id, type: store.getType()};
    this._relations = {};
    this._store = store;
    this.isSyncing = false;
    this.isSyncFailed = false;
    this.syncedSuccess = false;
    this._errors = {};
    this.deleted = false;
    this._isLoaded = false;
    this.loadData(store.constructor.defaults);
  }

  get(key) {
    return !_.isUndefined(this._attributes[key]) && _.isUndefined(this._relations[key])
      ? this._attributes[key]
      : this.getRelation(key);
  }

  getRelation(key) {
    const relation = this._relations[key];

    if (!_.isArray(relation)) {
      return relation;
    } else {
      return relation.filter(item => {
        return !item.deleted;
      });
    }
  }

  getType() {
    return this._store.getType();
  }

  getErrors() {
    return this._errors;
  }

  hasErrors() {
    return Object.keys(this._errors).length > 0;
  }

  startSync() {
    this.isSyncing = true;
    this.isSyncFailed = false;
    this.syncedSuccess = false;
  }

  failSync(errors) {
    this.isSyncing = false;
    this.isSyncFailed = true;
    this.syncedSuccess = false;
    this._errors = errors;
  }

  successSync() {
    this.isSyncing = false;
    this.isSyncFailed = false;
    this.syncedSuccess = true;
    this._errors = {};
  }

  loadData(data) {
    if (this._store.constructor.transformers) {
      this._store.constructor.transformers.forEach(transformer => {
        transformer(data, this._store);
      });
    }

    _.forEach(data, (value, name) => {
      if (name === '_isLoaded') {
        this._isLoaded = value;
        return;
      }
      if (name === 'image_file_ids') {
        return;
      }

      if (isAttribute(name, value)) {
        this.setAttribute(name, value);
      } else {
        this.setRelation(name, value);
      }
    });
  }

  setAttribute(name, value) {
    this._attributes[name] = value;
  }

  // Need to make this much simpler
  setRelation(name, value) {
    if (isId(name)) {
      const relationName = name.slice(0, -3);
      if (!this._store._getStore(getType(relationName))) {
        return;
      }
      this._relations[relationName] = this.getInstance(relationName, value);
    } else if (isIds(name)) {
      const relationName = pluralize.plural(name.slice(0, -4));
      if (!this._store._getStore(getType(relationName))) {
        return;
      }
      this._relations[relationName] = [];

      value.forEach(id => {
        this._relations[relationName].push(this.getInstance(relationName, id));
      });
    } else if (isObject(value)) {
      if (!value.id) {
        return;
      }
      if (!this._store._getStore(getType(value.type))) {
        return;
      }
      const instance = this.getInstance(value.type, value.id);
      instance.loadData(value);
      instance._store.emitChange();
      this._relations[name] = instance;
    } else if (isObjectArray(value)) {
      this._relations[name] = [];

      value.forEach(value => {
        if (!this._store._getStore(getType(value.type))) {
          return;
        }
        this._relations[name].push(this.getInstance(value.type, value.id));
      });
    }
  }

  add(name, id, multiple = true) {
    if (multiple) {
      this._relations[name] = this._relations[name] || [];

      if (!this._relations[name].some(instance => instance.get('id') === id)) {
        this._relations[name].push(this.getInstance(name, id));
      }
    } else {
      this._relations[name] = this.getInstance(name, id);
    }

    return this.getInstance(name, id);
  }

  remove(name, id) {
    if (_.isArray(this._relations[name])) {
      this._relations[name] = this._relations[name].filter(item => {
        return item.get('id') !== id;
      });
    } else {
      this._relations[name] = null;
    }
  }

  destroy() {
    this.deleted = true;
  }

  getInstance(name, id) {
    if (!id) {
      return null;
    }

    const store = this._store._getStore(getType(name));

    if (store) {
      return store.get(id);
    } else {
      return null;
    }
  }

  toJSON() {
    const json = _.clone(this._attributes);

    _.forEach(this._relations, (relationValue, relationName) => {
      if (!relationValue) {
        return;
      }

      if (_.isArray(relationValue)) {
        relationValue = relationValue.map(value => {
          return {
            id: value.get('id'),
            type: value.get('type')
          };
        });
      } else {
        relationValue = {
          id: relationValue.get('id'),
          type: relationValue.get('type')
        };
      }

      json[relationName] = relationValue;
    });

    json._isLoaded = this._isLoaded;

    return json;
  }

  load() {
    this._isLoaded = true;
  }

  unload() {
    this._isLoaded = false;
  }

  isLoaded() {
    return this._isLoaded;
  }
}

class DataStore extends BaseStore {

  static storeName = 'DataStore';

  static handlers = {
    [Actions.LOAD_DATA_SUCCESS]: 'handleLoadDataSuccess',
    [Actions.LOAD_INCLUDED_SUCCESS]: 'handleLoadIncludedSuccess',
    [Actions.UPDATE_INSTANCE]: 'handleUpdateInstance',
    [Actions.FAIL_SYNC]: 'handleFailSync',
    [Actions.DELETE_ITEM]: 'handleDeleteItem',
    [Actions.UPDATE_ITEM]: 'handleUpdateItem',
    [Actions.REMOVE_FROM_RELATION]: 'handleRemoveFromRelation',
    [Actions.CREATE_START]: 'handleCreateStart',
    [Actions.CREATE_SUCCESS]: 'handleCreateSuccess',
    [Actions.CREATE_FAILURE]: 'handleCreateFailure',
    [Actions.UPDATE_START]: 'handleUpdateStart',
    [Actions.UPDATE_SUCCESS]: 'handleUpdateSuccess',
    [Actions.UPDATE_FAILURE]: 'handleUpdateFailure',
    [Actions.DELETE_START]: 'handleDeleteStart',
    [Actions.DELETE_SUCCESS]: 'handleDeleteSuccess',
    [Actions.DELETE_FAILURE]: 'handleDeleteFailure',
    [Actions.ADD_TO_RELATION]: 'handleAddToRelation',
    [Actions.RESET_NEW]: 'handleResetNew',
    [Actions.LOAD_DATA_ITEM]: 'loadDataItem',
    [Actions.UNLOAD_DATA_ITEM]: 'unloadDataItem'
  };

  static defaults = {};

  handleCreateStart({id, type, json = {}}) {
    const store = this._getStore(type);
    const instance = store.get(id);

    instance.loadData(json);
    instance.startSync();
    store.emitChange();
  }

  handleCreateSuccess({id, type, json}) {
    this._updateInstance({id, type, json});
  }

  _updateInstance({id, type, json}) {
    const store = this._getStore(type);
    const instance = store.get(id);

    instance.loadData(json[type]);
    instance.successSync();

    this.loadObjects(json.included);

    store.emitChange();
  }

  handleCreateFailure({id, type, errors = {}}) {
    const store = this._getStore(type);

    store.get(id).failSync(errors);
    store.emitChange();
  }

  handleUpdateStart({id, type}) {
    const store = this._getStore(type);
    const instance = store.get(id);

    instance.startSync();
    store.emitChange();
  }

  handleDeleteStart({id, type}) {
    const store = this._getStore(type);
    const instance = store.get(id);

    instance.startSync();
    store.emitChange();
  }

  handleDeleteSuccess({id, type}) {
    const store = this._getStore(type);

    delete store._instances[id];
    store.emitChange();
  }

  handleUpdateSuccess({id, type}) {
    const store = this._getStore(type);
    const instance = store.get(id);

    instance.successSync();
    store.emitChange();
  }

  handleUpdateFailure({id, type, errors = {}}) {
    const store = this._getStore(type);
    const instance = store.get(id);

    instance.failSync(errors);
    store.emitChange();
  }

  handleDeleteFailure({id, type}) {
    const store = this._getStore(type);
    const instance = store.get(id);

    instance.failSync();
    store.emitChange();
  }

  handleAddToRelation({id, type, relation, objectId, multiple}) {
    const store = this._getStore(type);
    const instance = store.get(id);

    instance.add(relation, objectId, multiple);
    store.emitChange();
  }

  handleLoadDataSuccess({json}) {
    if (!json) {
      return;
    }

    const type = _.omit(Object.keys(json), 'included')[0];
    const store = this._getStore(type);

    store.loadFromJSON(json);
    store.emitChange();
  }

  handleLoadIncludedSuccess({json, rootId, rootType}) {
    if (!json) {
      return;
    }

    const includedType = Object.keys(_.omit(json, 'included'))[0];
    const included = json.included || {};

    if (!includedType) {
      return;
    }

    included[includedType] = json[includedType];

    const revisedJSON = {
      [rootType]: {
        id: rootId,
        type: rootType,
        [includedType + '_ids']: json[includedType].map(item => item.id)
      },
      included
    };

    this.handleLoadDataSuccess({json: revisedJSON});
  }

  handleUpdateInstance({json, id}) {
    const type = _.omit(Object.keys(json), 'included')[0];
    const store = this._getStore(type);
    const instance = store.get(id);

    instance.loadData(json[type]);
    store._instances[json[type].id] = instance;
    delete store._instances[id];
    instance.successSync();

    this.loadObjects(json.included);

    store.emitChange();
  }

  handleDeleteItem({id, type}) {
    const store = this._getStore(type);
    store.get(id).destroy();
    store.emitChange();
  }

  handleRemoveFromRelation({id, type, objectId, relation}) {
    const store = this._getStore(type);
    store.get(id).remove(relation, objectId);
    store.emitChange();
  }

  handleUpdateItem({id, type, attributes}) {
    const store = this._getStore(type);

    _.forEach(attributes, (value, key) => {
      store.get(id).setAttribute(key, value);
    });

    store.emitChange();
  }

  handleFailSync({id, type}) {
    const store = this._getStore(type);
    const instance = store.get(id);

    instance.failSync();
    store.emitChange();
  }

  handleResetNew({type, json}) {
    const store = this._getStore(type);
    store.resetNew(json);
    store.emitChange();
  }

  constructor(dispatcher) {
    super(dispatcher);

    this._instances = {};
    this._dispatcher = dispatcher;
    this._instanceClass = this.constructor.InstanceClass || Instance;
  }

  clear() {
    this._instances = {};
  }

  has(id) {
    return Boolean(this._instances[id]);
  }

  get(id) {
    if (!id) {
      return null;
    }

    return this._instances[id] || (this._instances[id] = new this._instanceClass(id, this));
  }

  getAll() {
    return Object.values(this._instances).filter(instance => !instance.deleted);
  }

  toJSON() {
    return _.reduce(this._instances, (memo, instance) => {
      const json = instance.toJSON();

      return memo.concat(json);
    }, []);
  }

  getType() {
    return this.constructor.type;
  }

  _getStore(type) {
    try {
      return this._dispatcher.getStore(getStoreClass(type));
    } catch (e) {
      logger.error(`Failed to found store ${getStoreClass(type)}`);
      return null;
    }
  }

  updateItem(json) {
    if (!json.id) {
      return;
    }
    const item = this.get(json.id);
    item.loadData(json);
  }

  del(json) {
    const item = this.get(json.id);
    item.deleted = true;
  }

  getNew() {
    return this._instances['NEW'];
  }

  resetNew(json) {
    const instance = new this._instanceClass('NEW', this);
    if (json) {
      instance.loadData(json);
    }
    this._instances['NEW'] = instance;
  }

  loadFromJSON(json) {
    if (!json) {
      return;
    }

    const included = json.included || {};

    this.loadObjects(included);
    this.loadObjects(_.omit(json, ['included', 'meta']));
  }

  loadObjects(json) {
    const types = {};

    _.forEach(json, items => {
      if (!_.isArray(items)) {
        items = [items];
      }

      items.forEach(item => {
        types[item.type] = null;
        const store = this._getStore(item.type);

        if (!store) {
          return;
        }

        store.updateItem(item);
      });
    });

    Object.keys(types).forEach(type => {
      const store = this._getStore(type);

      if (!store) {
        return;
      }

      store.emitChange();
    });
  }

  loadDataItem({id, storeName}) {
    this._dispatcher.getStore(storeName).get(id).load();
    this._dispatcher.getStore(storeName).emitChange();
  }

  unloadDataItem({id, storeName}) {
    this._dispatcher.getStore(storeName).get(id).unload();
    this._dispatcher.getStore(storeName).emitChange();
  }

  dehydrate() {
    return {
      json: this.toJSON()
    };
  }

  rehydrate({json}) {
    if (json) {
      this.loadFromJSON({[this.getType()]: json});
    }
  }

}

export {DataStore, Instance};



// WEBPACK FOOTER //
// ./src/main/app/stores/DataStore.js