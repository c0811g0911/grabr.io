// Actions to run when the router matches a route. Used in ./routes.js
import {loadUserForAdmin} from './LoginActionCreators';
import {Actions} from '../actions/Constants';
import {makeAuthorizedRequest} from '../utils/ActionUtils';

export const getReferrer = (context, {referralCode}, done) => {
  return makeAuthorizedRequest('get', `/referrers/${ referralCode }`, {version: 2}, context).then(res => {
    context.dispatch(Actions.LOAD_SEQUENCE_SUCCESS, {
      json: res.body,
      key: 'referrer',
      sequenceName: 'Referral'
    });
  });
};



// WEBPACK FOOTER //
// ./src/main/app/actions/ReferralActions.js