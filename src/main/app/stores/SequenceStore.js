import {BaseStore} from 'fluxible/addons';
import {getStoreClass, getSequenceClass} from '../utils/StoreUtils';
import {Actions} from '../actions/Constants';
import pluralize from 'pluralize';
import _ from 'lodash';

export class SequenceStore extends BaseStore {

  static storeName = 'SequenceStore';

  static defaultValue = [];

  static handlers = {
    [Actions.LOAD_SEQUENCE_SUCCESS]: 'handleLoadSequenceSuccess',
    [Actions.REMOVE_FROM_SEQUENCE]: 'handleRemoveFromSequence',
    [Actions.CLEAR_SEQUENCES]: 'handleClearSequences',
    [Actions.SET_SEQUENCE_INFO]: 'handleSetSequenceInfo',
    [Actions.AMPLIFY_SEQUENCE_ITEM]: 'handleAmplifySequenceItem',
    [Actions.UNLOAD_SEQUENCE]: 'handleUnloadSequence'
  };

  handleLoadSequenceSuccess({json, sequenceName, key, append, totalCount}) {
    const store = this._dispatcher.getStore(getSequenceClass(sequenceName));

    if (json) {
      store.loadFromJSON(json, key, append);
    } else {
      store.clear();
    }

    store.setInfo('isSyncing', false);
    store.setInfo('syncSuccess', true);
    store.setInfo('totalCount', totalCount);
    store._loaded = true;
    store.emitChange();
  }

  handleRemoveFromSequence({id, sequenceName}) {
    const store = this._dispatcher.getStore(getSequenceClass(sequenceName));

    store.remove(id);
    store.emitChange();
  }

  handleClearSequences({sequenceNames}) {
    sequenceNames.forEach(sequenceName => {
      const store = this._dispatcher.getStore(getSequenceClass(sequenceName));

      store.clear();
      store.emitChange();
    });
  }

  handleSetSequenceInfo({data, sequenceName}) {
    const store = this._dispatcher.getStore(getSequenceClass(sequenceName));

    _.forEach(data, (value, name) => {
      store.setInfo(name, value);
    });
    store.emitChange();
  }

  handleAmplifySequenceItem({id, sequenceName}) {
    const store = this._dispatcher.getStore(getSequenceClass(sequenceName));

    const {_sequence} = store;
    const item = _sequence.find(item => item.id === id);
    const index = _sequence.indexOf(item);

    store._sequence = [_sequence[index], ..._sequence.slice(0, index), ..._sequence.slice(index + 1)];
    store.emitChange();
  }

  handleUnloadSequence({sequenceName, sequenceNames}) {
    if (sequenceName) {
      sequenceNames = [sequenceName];
    }
    sequenceNames.forEach(sequenceName => {
      const store = this._dispatcher.getStore(getSequenceClass(sequenceName));
      store.unload();
      store.emitChange();
    });
  }

  constructor(dispatcher) {
    super(dispatcher);

    this._sequence = this.constructor.defaultValue;
    this._info = {};
    this._loaded = false;
    this._dispatcher = dispatcher;
  }

  append(json) {
    this._sequence = this._sequence.concat(this.load(json));
  }

  getType() {
    return this.constructor.type;
  }

  _getStore(type = null) {
    return this._dispatcher.getStore(getStoreClass(type || this.getType()));
  }

  setInfo(name, value) {
    this._info[name] = value;
  }

  getInfo(name) {
    return this._info[name] || null;
  }

  hasMore() {
    return this._info['totalCount'] > this._sequence.length;
  }

  unload() {
    this._loaded = false;
    this._sequence = this.constructor.defaultValue;
  }

  // fixme: too much magic, explicitness saves.
  loadFromJSON(json, key = null, append = false) {
    this._getStore().loadFromJSON(json);

    const sequence = json[key || this.getType()] || json[pluralize.plural(this.getType())];

    if (!sequence) {
      return;
    }

    if (_.isArray(this._sequence)) {
      let newSequence;

      if (_.isArray(sequence)) {
        newSequence = sequence.map(instance => {
          return {id: instance.id, type: instance.type};
        });
      } else {
        newSequence = [{id: sequence.id, type: sequence.type}];
      }

      if (append) {
        this._sequence = this._sequence.concat(newSequence);
      } else {
        this._sequence = newSequence;
      }
    } else {
      this._sequence = {id: sequence.id, type: sequence.type};
    }
  }

  get() {
    if (this._sequence) {
      if (_.isArray(this._sequence)) {
        return this._sequence.map(object => {
          return this._getStore(object.type).get(object.id);
        });
      } else {
        return this._getStore(this._sequence.type).get(this._sequence.id);
      }
    } else {
      return this.constructor.defaultValue;
    }
  }

  clear() {
    this._sequence = this.constructor.defaultValue;
    this._info = {};
  }

  isLoaded() {
    return this._loaded;
  }

  remove(id, type = null) {
    if (_.isArray(this._sequence)) {
      this._sequence = this._sequence.filter(element => {
        return element.id !== id && (!type || element.type !== type);
      });
    } else {
      if (this._sequence.id === id) {
        this.clear();
      }
    }
  }

  dehydrate() {
    return {
      sequence: this._sequence,
      info: this._info,
      loaded: this._loaded
    };
  }

  rehydrate({sequence, info, loaded}) {
    this._sequence = sequence;
    this._info = info;
    this._loaded = loaded;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/stores/SequenceStore.js