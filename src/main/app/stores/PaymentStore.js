import {BaseStore} from 'fluxible/addons';
import {Actions} from '../actions/Constants';

export class PaymentStore extends BaseStore {

  static storeName = 'PaymentStore';

  static handlers = {
    [Actions.ADD_COUPON]: 'addCoupon'
  };

  constructor(dispatcher) {
    super(dispatcher);

    this.couponId = null;
  }

  addCoupon({couponId}) {
    this.couponId = couponId;
    this.emitChange();
  }

  getCouponId() {
    return this.couponId;
  }

  shouldDehydrate() {
    return false;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/stores/PaymentStore.js