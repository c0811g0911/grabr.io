import {Actions} from '../actions/Constants';
import uuid from 'node-uuid';
import {BaseStore} from 'fluxible/addons';

export class AlertStore extends BaseStore {
  static storeName = 'AlertStore';

  static handlers = {
    [Actions.SHOW_ALERT]: 'handleShowAlert',
    [Actions.HIDE_ALERT]: 'handleHideAlert'
  };

  constructor(dispatcher) {
    super(dispatcher);

    this.alerts = [];
  }

  handleShowAlert({data}) {
    const id = uuid.v4();

    this.alerts.push({data, id, hidden: true});
    this.emitChange();

    setTimeout(() => {
      this.updateAlert(id, false);
      this.emitChange();
    }, 100);

    setTimeout(() => {
      this.handleHideAlert({id});
    }, 5000);
  }

  handleHideAlert({id}) {
    this.updateAlert(id, true);
    setTimeout(() => {
      this.clearAlerts();
    }, 1000);
    this.emitChange();
  }

  updateAlert(id, hidden = false) {
    this.alerts = this.alerts.map(alert => {
      if (alert.id === id) {
        alert.hidden = hidden;
      }

      return alert;
    });
  }

  clearAlerts() {
    this.alerts = this.alerts.filter(alert => !alert.hidden);
    this.emitChange();
  }

  get() {
    return this.alerts;
  }

  shouldDehydrate() {
    return false;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/stores/AlertStore.js