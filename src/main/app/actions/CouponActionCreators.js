import {makeAuthorizedRequest} from '../utils/ActionUtils';
import {Actions} from '../actions/Constants';
import {MyCouponsStore} from '../stores/SequenceStores';
import {setFormErrors} from '../actions/AppActionCreators';

export async function createCoupon(context, {token, formName, callback}) {
  try {
    const {body: json} = await makeAuthorizedRequest('post', '/coupons', {query: {coupon: {token}}, version: 2}, context);

    if (callback) {
      callback(json.coupon.id);
    }

    context.executeAction(setFormErrors, {formName, errors: null});
    return context.executeAction(loadMyCoupons);
  } catch (err) {
    let errors = null;

    if (err.response) {
      errors = err.response.body.errors;
    }

    context.executeAction(setFormErrors, {formName, errors});
  }
}

export async function loadMyCoupons(context) {
  const {body: json} = await makeAuthorizedRequest('get', '/coupons', {version: 2}, context);
  return context.dispatch(Actions.LOAD_SEQUENCE_SUCCESS, {
    json, sequenceName: MyCouponsStore.sequenceName
  });
}

export function setPaymentCoupon(context, {couponId}) {
  context.dispatch(Actions.ADD_COUPON, {couponId});
}

export function cancelCreateCoupon(context, {formName}) {
  context.executeAction(setFormErrors, {formName, errors: null});
}



// WEBPACK FOOTER //
// ./src/main/app/actions/CouponActionCreators.js