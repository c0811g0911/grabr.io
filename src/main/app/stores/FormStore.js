import {BaseStore} from 'fluxible/addons';
import {Actions} from '../actions/Constants';

export class FormStore extends BaseStore {

  static storeName = 'FormStore';

  static handlers = {
    [Actions.RESET_FORM]: 'onResetForm',
    [Actions.UPDATE_ATTRIBUTES]: 'onUpdateAttributes',
    [Actions.UPDATE_ERRORS]: 'onUpdateErrors',
    [Actions.SWITCH_STEP]: 'onSwitchStep',
    [Actions.NEXT_STEP]: 'onNextStep',
    [Actions.START_SYNC]: 'onStartSync',
    [Actions.FINISH_SYNC]: 'onFinishSync'
  };

  constructor(dispatcher) {
    super(dispatcher);

    this._attributes = {};
    this._errors = {};
    this._step = 0;
    this._maxStep = 0;
    this._isSyncing = false;
    this._loaded = false;
  }

  onResetForm({attributes = {}, schema = {}, step = 0}) {
    this._attributes = attributes;
    this._errors = {};
    this._schema = schema;
    this._step = step;
    this._maxStep = step;
    this._isSyncing = false;

    if (Object.keys(attributes).length !== 0) {
      this._loaded = true;
    } else {
      this._loaded = false;
    }

    this.emitChange();
  }

  onStartSync() {
    this._isSyncing = true;
    this.emitChange();
  }

  onFinishSync() {
    this._isSyncing = false;
    this.emitChange();
  }

  onUpdateAttributes(attributes) {
    this._attributes = {...this._attributes, ...attributes};

    this.emitChange();
  }

  onUpdateErrors(errors) {
    this._errors = errors;

    this.emitChange();
  }

  onSwitchStep(step) {
    if (!this.canSwitchStep(step)) {
      return;
    }

    this._step = step;
    this.emitChange();
  }

  onNextStep() {
    this._step = this._step + 1;
    this._maxStep = this._step;

    this.emitChange();
  }

  // Public methods
  //
  getAttributes() {
    return this._attributes;
  }

  getErrors() {
    return this._errors;
  }

  getSchema() {
    return this._schema[this._step];
  }

  getStep() {
    return this._step;
  }

  canSwitchStep(step) {
    return step <= this._maxStep;
  }

  isSyncing() {
    return this._isSyncing;
  }

  isLoaded() {
    return this._loaded;
  }

  dehydrate() {
    return {
      attributes: this._attributes,
      errors: this._errors,
      schema: this._schema,
      step: this._step,
      maxStep: this._maxStep,
      loaded: this._loaded
    };
  }

  rehydrate({attributes, errors, schema, step, maxStep, loaded}) {
    this._attributes = attributes;
    this._errors = errors;
    this._schema = schema;
    this._step = step;
    this._maxStep = maxStep;
    this._loaded = loaded;
  }

}



// WEBPACK FOOTER //
// ./src/main/app/stores/FormStore.js