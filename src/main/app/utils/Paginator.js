export class Paginator {
  constructor(context, config) {
    this.action = config.action;
    this.store = context.getStore(config.storeName);
    this.pageSize = config.pageSize || 20;
    this.loadRest = config.loadRest || false;
    this.context = context;
    this.pageNumber = 0;
    this.filters = config.filters || {};
  }

  reload() {
    this.pageNumber = 0;
    this._executeAction();
  }

  loadMore() {
    this.pageNumber += 1;
    this._executeAction();
  }

  applyFilter(key, value) {
    this.filters = {...this.filters, [key]: value};
    this.reload();
  }

  removeFilter(key) {
    delete this.filters[key];
    this.reload();
  }

  isSyncing() {
    return this.store.getInfo('isSyncing');
  }

  getTotalCount() {
    return this.store.getInfo('totalCount');
  }

  hasMore() {
    return this.store.getInfo('totalCount') > this.store.get().length;
  }

  getSequence() {
    return this.store.get();
  }

  _executeAction() {
    this.context.executeAction(this.action, {
      pageSize: !this.loadRest || this.pageNumber === 0 ? this.pageSize : null,
      pageNumber: this.pageNumber,
      append: !this.loadRest && this.pageNumber !== 0,
      filters: this.filters
    });
  }
}



// WEBPACK FOOTER //
// ./src/main/app/utils/Paginator.js