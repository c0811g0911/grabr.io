import {Actions} from '../actions/Constants';
import {BaseStore} from 'fluxible/addons';

export class CounterStore extends BaseStore {
  static storeName = 'CounterStore';

  static handlers = {
    [Actions.CHANGE_COUNT]: 'handleChangeCount'
  };

  constructor(dispatcher) {
    super(dispatcher);

    this._counters = {};
  }

  handleChangeCount({counters}) {
    this.changeCount(counters);
  }

  changeCount(counters) {
    this._counters = {...this._counters, ...counters};

    this.emitChange();
  }

  get(key) {
    return this._counters[key] || 0;
  }

  dehydrate() {
    return {
      counters: this._counters
    };
  }

  rehydrate({counters}) {
    this._counters = counters;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/stores/CounterStore.js