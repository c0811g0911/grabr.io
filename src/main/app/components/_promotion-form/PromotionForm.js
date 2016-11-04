import moment from 'moment';
import {Money} from '../_money/Money';
import {Link} from 'react-router/es6';
import React from 'react';
import {renderFields} from '../../renderers/renderFields';
import {SyncButton} from '../_sync-button/SyncButton';
import {Validator} from '../../utils/Validator';
import {connectToStores} from 'fluxible-addons-react';
import {createAdminPromotion, updateAdminPromotion} from '../../actions/AdminPromotionActionCreators';
import {DateTimeInput} from '../_date-time-input/DateTimeInput';
import {FormattedMessage} from 'react-intl';
import {PromotionShape, shapePromotion} from '../../models/PromotionModel';
import {PromotionStore} from '../../stores/DataStores';

const {bool, func, number, oneOfType, string} = React.PropTypes;

const schema = {
  amount_cents: ['required'],
  expires_at: ['required'],
  quantity: ['required', 'is_number'],
  token: ['required'],
  usage_quota: ['required', 'is_number']
};

const messages = {
  amount_cents: {
    required: "Amount can't be blank"
  },
  expires_at: {
    required: "Expiry date can't be blank"
  },
  quantity: {
    required: "Quantity can't be blank",
    is_number: 'Quantity should be a number'
  },
  token: {
    required: "Promotion token can't be blank"
  },
  usage_quota: {
    required: "Usage quota can't be blank",
    is_number: 'Usage quota should be a number'
  }
};

const formSchema = update => ({
  amount_cents: {
    input: Money,
    inputProps: {
      asInput: true,
      disabled: update
    },
    label: 'Discount amount'
  },
  expires_at: {
    input: DateTimeInput,
    inputProps: {
      minDate: moment()
    },
    label: 'Expiry date'
  },
  quantity: {
    label: 'Number of codes available'
  },
  token: {
    label: 'Code',
    inputProps: {
      disabled: update
    }
  },
  usage_quota: {
    label: 'Usage quota'
  }
});

export const PromotionForm = connectToStores(class extends React.Component {
  static displayName = 'PromotionForm';

  static propTypes = {
    id: oneOfType([number, string]).isRequired,
    isSyncing: bool.isRequired,
    promotion: PromotionShape.isRequired,
    update: bool.isRequired
  };

  static contextTypes = {
    executeAction: func.isRequired
  };

  constructor(props) {
    super(props);

    const {promotion, update} = this.props;
    this.state = {
      attributes: {
        ...promotion,
        expires_at: promotion.expires_at || moment().add(14, 'days').format('YYYY-MM-DD')
      },
      errors: {}
    };
    this.validator = new Validator(this, schema);
    this.formSchema = formSchema(update);
  }

  componentWillReceiveProps({errors}) {
    this.setState({errors});
  }

  render() {
    const {context: {executeAction}, formSchema, validator} = this;
    const {attributes} = this.state;
    const {id, isSyncing, update} = this.props;
    return <form className="grabr-form" onSubmit={event => {
      event.preventDefault();
      if (validator.validateForm()) {
        const payload = {id, promotion: attributes};
        if (update) {
          executeAction(updateAdminPromotion, payload);
        } else {
          executeAction(createAdminPromotion, payload);
        }
      }
    }}>
      <fieldset>{renderFields('admin_promotion', formSchema, {component: this, validator, messages})}</fieldset>
      <section className="flex-row flex-justify-center controls">
        <SyncButton type="submit" isSyncing={isSyncing}>
          <FormattedMessage id={update ? 'save' : 'create'}/>
        </SyncButton>
        <Link to="/admin/promotions" className="flex-self-center transparent link-unstyled" type="button">
          <FormattedMessage id="shared.cancel"/>
        </Link>
      </section>
    </form>;
  }
}, [PromotionStore], (context, {id}) => {
  const promotion = context.getStore(PromotionStore).get(id);
  return {
    isSyncing: promotion.isSyncing,
    promotion: shapePromotion(promotion),
    errors: promotion.getErrors()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_promotion-form/PromotionForm.js