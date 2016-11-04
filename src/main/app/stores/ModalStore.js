import {BaseStore} from 'fluxible/addons';
import {Actions} from '../actions/Constants';

export class ModalStore extends BaseStore {

  static storeName = 'ModalStore';

  static handlers = {
    [Actions.OPEN_MODAL]: 'handleOpenModal',
    [Actions.CLOSE_MODAL]: 'handleCloseModal',
    [Actions.CLOSE_ALL_MODALS]: 'handleCloseAllModals',
    [Actions.OPEN_ERROR_MODAL]: 'handleOpenErrorModal'
  };

  constructor(dispatcher) {
    super(dispatcher);

    this.modals = [];
  }

  handleOpenModal({contentCreator}) {
    this.modals.push({contentCreator});
    this.emitChange();
  }

  handleOpenErrorModal({error, message}) {
    this.modals.push({error, message});
    this.emitChange();
  }

  handleCloseModal() {
    this.modals.pop();
    this.emitChange();
  }

  handleCloseAllModals() {
    this.modals = [];
    this.emitChange();
  }

  getTop() {
    return this.modals[this.modals.length - 1];
  }

  shouldDehydrate() {
    return false;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/stores/ModalStore.js