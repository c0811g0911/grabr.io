import _ from 'lodash';
import moment from 'moment';

export class Validator {
  constructor(component, schema = {}) {
    this.component = component;
    this.schema = schema;
  }

  addSchema(schema) {
    this.schema = _.merge(this.schema, schema);
  }

  validateForm() {
    const errors = this.validate(this.component.state.attributes);

    this.component.setState({errors});
    return this.isValid(errors);
  }

  validate(attributes) {
    const errors = {};

    _.forEach(this.schema, (values, key) => {
      errors[key] = this.getAttributeErrors(attributes[key], key, attributes);
    });

    return errors;
  }

  hasError(errors, key) {
    return errors[key] && errors[key][0];
  }

  isValid(errors) {
    return Object.keys(_.pickBy(errors, error => error.length > 0)).length === 0;
  }

  getAttributeErrors(attributeValue, key, attributes) {
    const errors = [];

    const schema = _.isFunction(this.schema[key]) ? this.schema[key](attributes) : this.schema[key];

    schema.forEach(value => {
      let condition = false;

      const type = _.isObject(value) ? Object.keys(value)[0] : value;

      attributeValue = attributeValue || '';

      if (['required', 'required_array'].indexOf(type) === -1 && attributeValue.length === 0) {
        return;
      }

      switch (type) {
        case 'required':
          condition = !!attributeValue;
          break;
        case 'min_length':
          condition = attributeValue.length >= value[type];
          break;
        case 'max_length':
          condition = attributeValue.length <= value[type];
          break;
        case 'max_number':
          condition = attributeValue <= value[type];
          break;
        case 'min_number':
          condition = attributeValue >= value[type];
          break;
        case 'email':
          condition = /.+\@.+\..+/.test(attributeValue);
          break;
        case 'phone':
          condition = /\+1\(\d{3}\)\d{3}-\d{4}/.test(attributeValue);
          break;
        case 'legal_age':
          condition = moment.utc(moment().diff(moment(attributeValue))).year() - 1970 >= 18;
          break;
        case 'deadline':
          const difference = moment.utc(moment(attributeValue).diff(moment()));

          condition = difference.dayOfYear() < value[type] && difference.year() - 1970 === 0;
          break;
        case 'future':
          condition = moment.utc(moment(attributeValue).diff(moment())).year() - 1970 >= 0;
          break;
        case 'required_array':
          condition = attributeValue.length && attributeValue.length > 0;
          break;
        case 'stripe_routing_number':
          condition = Stripe.bankAccount.validateRoutingNumber(attributeValue, attributes.country);
          break;
        case 'stripe_account_number':
          condition = Stripe.bankAccount.validateAccountNumber(attributeValue, attributes.country);
          break;
        case 'stripe_expiry':
          condition = Stripe.card.validateExpiry(attributeValue.split('/')[0], attributeValue.split('/')[1]);
          break;
        case 'stripe_card_number':
          condition = Stripe.card.validateCardNumber(attributeValue);
          break;
        case 'stripe_cvc':
          condition = Stripe.card.validateCVC(attributeValue);
          break;
        case 'url':
          condition = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(attributeValue);
          break;
        case 'confirm':
          condition = attributeValue === attributes['confirm_' + key];
          break;
        case 'is_number':
          condition = _.isNumber(+attributeValue);
          break;
      }

      if (!condition) {
        errors.push(type);
      }
    });

    return errors;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/utils/Validator.js