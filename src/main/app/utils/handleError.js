import {Actions} from '../actions/Constants';

export const handleError = (err, context, options = {}) => {
  const action = options.action || Actions.LOAD_ACCOUNT_FAILURE;
  const actionOptions = options.actionOptions || {};

  context.dispatch(action, actionOptions);

  logger.error(err);

  let error;

  if (err.response) {
    error = err.response.body;
  } else if (err.errors) {
    error = err;
  } else {
    if (window.Raygun) {
      Raygun.send(err);
    }
    logger.error(err);
    context.dispatch(Actions.OPEN_ERROR_MODAL, {error: 'unexpected'});
    return;
  }

  if (options.notify) {
    options.notify(error || err);
  }

  if (error.status === '500') {
    if (window.Raygun) {
      Raygun.send(err);
    }
    logger.error(err);
    context.dispatch(Actions.OPEN_ERROR_MODAL, {error: 'unexpected'});
    return;
  }

  if (options.customHandler) {
    options.customHandler(error);
    return;
  }

  if (error.errors) {
    const errors = error.errors;

    if (errors.authorization && Array.isArray(errors.authorization)) {
      context.dispatch(Actions.OPEN_ERROR_MODAL, {error: errors.authorization[0]});
    } else {
      /*
       transform  {"errors":{"credit_card.stripe_card_error":["..."]}}
       to         {"errors":{"stripe_card_error":["..."]}}
       */
      const normalizedErrors = {};
      for (const key of Object.keys(errors)) {
        normalizedErrors[key.split('.').slice(-1)[0]] = errors[key];
      }
      context.dispatch(action, {...actionOptions, errors: normalizedErrors});
    }
  }
};



// WEBPACK FOOTER //
// ./src/main/app/utils/handleError.js