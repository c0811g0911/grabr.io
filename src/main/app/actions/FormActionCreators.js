import {Actions} from '../actions/Constants';
import {Validator} from '../utils/Validator_2';
import {FormStore} from '../stores/FormStore';

export function updateAttributes(context, attributes) {
  return context.dispatch(Actions.UPDATE_ATTRIBUTES, attributes);
}

export function resetForm(context, payload) {
  return context.dispatch(Actions.RESET_FORM, payload);
}

export function switchStep(context, {step}) {
  return context.dispatch(Actions.SWITCH_STEP, step);
}

export function submitForm(context, {action, attributes, params}) {
  const schema = context.getStore(FormStore).getSchema();
  const validator = new Validator(schema);
  const errors = validator.validate(attributes);

  if (validator.isValid(errors)) {
    context.executeAction(action, {attributes, ...params});
  }
  context.dispatch(Actions.UPDATE_ERRORS, errors);
}



// WEBPACK FOOTER //
// ./src/main/app/actions/FormActionCreators.js