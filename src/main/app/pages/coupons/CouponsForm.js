import React, {Component, PropTypes} from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {FormattedMessage} from 'react-intl';

import {AppStore} from '../../stores/AppStore';
import {createCoupon, cancelCreateCoupon} from '../../actions/CouponActionCreators';

const formName = 'coupons';

export const CouponsForm = connectToStores(class extends Component {
  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  static propTypes = {
    errors: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {token: ''};
  }

  componentWillUnmount() {
    this.context.executeAction(cancelCreateCoupon, {formName});
  }

  handleChange = event => {
    this.setState({token: event.target.value});
  };

  handleSubmit = event => {
    event.preventDefault();

    const {token} = this.state;
    this.context.executeAction(createCoupon, {token, formName});
  };

  render() {
    const {token} = this.state;
    const {errors} = this.props;
    const placeholder = this.context.intl.formatMessage({id: 'components.coupons.new_placeholder'});

    return (
      <div>
        <If condition={errors && errors.coupon}>
          <div className="p-x-1 text-error">
            <FormattedMessage id={`components.coupons.${errors.coupon[0]}`}/>
          </div>
        </If>

        <form className="input-group m-b-1 p-x-1" onSubmit={this.handleSubmit}>
          <input type="text"
                 className="form-control"
                 placeholder={placeholder}
                 value={token}
                 onChange={this.handleChange}
          />
          <span className="input-group-btn">
            <button className="btn btn-primary" type="submit">
              <FormattedMessage id="components.coupons.new_button"/>
            </button>
          </span>
        </form>
      </div>
    );
  }
}, [AppStore], context => ({
  errors: context.getStore(AppStore).getFormErrors({formName})
}))



// WEBPACK FOOTER //
// ./src/main/app/pages/coupons/CouponsForm.js