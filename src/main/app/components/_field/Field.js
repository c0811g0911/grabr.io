import React, {PropTypes} from 'react';
import _ from 'lodash';
import {FormattedMessage} from 'react-intl';
import {AppStore} from '../../stores/AppStore';

class TextareaInput extends React.Component {
  static displayName = 'TextareaInput';

  static propTypes = {
    onChange: PropTypes.func.isRequired
  };

  handleChange(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    return <textarea {...this.props} onChange={this.handleChange.bind(this)}/>;
  }
}

class CheckboxInput extends React.Component {
  static displayName = 'CheckboxInput';

  static propTypes = {
    onChange: PropTypes.func.isRequired
  };

  handleChange(event) {
    this.props.onChange(event.target.checked);
  }

  render() {
    return <input type="checkbox" checked={this.props.value} onChange={this.handleChange.bind(this)}/>;
  }
}

class TextInput extends React.Component {
  static displayName = 'TextInput';

  static propTypes = {
    onChange: PropTypes.func.isRequired
  };

  handleChange(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    return <input {...this.props} onChange={this.handleChange.bind(this)}/>;
  }
}

class DivInputWrapper extends React.Component {
  static displayName = 'DivInputWrapper';

  render() {
    return <div className="grabr-input">
      {this.props.children}
    </div>;
  }
}

class LabelInputWrapper extends React.Component {
  static displayName = 'LabelInputWrapper';

  render() {
    return <label className="grabr-input">
      {this.props.children}
    </label>;
  }
}

export class Field extends React.Component {
  static displayName = 'Field';

  static contextTypes = {
    getStore: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  static propTypes = {
    labelText: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    validator: PropTypes.any,
    errors: PropTypes.object.isRequired,
    attributes: PropTypes.object.isRequired,
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    changeAttribute: PropTypes.func.isRequired,
    input: PropTypes.any,
    inputProps: PropTypes.object,
    wrapInDiv: PropTypes.bool,
    showLabel: PropTypes.bool
  };

  static defaultProps = {
    labelText: '',
    input: TextInput,
    inputProps: {},
    wrapInDiv: false,
    showLabel: true
  };

  constructor(props) {
    super(props);

    this.fieldPrefix = `forms.${ this.props.formName }.fields.${ this.props.name }`;
  }

  handleChange(value) {
    this.props.changeAttribute(this.props.name, value);
  }

  getPlaceholder(props) {
    if (this.props.placeholder) {
      return _.isFunction(this.props.placeholder) ? this.props.placeholder(props) : this.props.placeholder;
    }
    const appStore = this.context.getStore(AppStore);
    const placeholderKey = _.isFunction(this.props.placeholderKey) ? this.props.placeholderKey(props) : 'placeholder';

    return appStore.getCurrentIntlMessages()[`${ this.fieldPrefix }.${ placeholderKey }`];
  }

  getLabel(props) {
    if (this.props.label) {
      return this.props.label;
    }
    const labelKey = _.isFunction(this.props.labelKey) ? this.props.labelKey(props) : 'label';
    return <FormattedMessage id={`${ this.fieldPrefix }.${ labelKey }`}/>;
  }

  renderError() {
    const errors = this.props.errors[this.props.name];

    if (!this.props.validator) {
      return null;
    }
    if (!errors || errors.length === 0) {
      return null;
    }

    return <div className="grabr-error">
      {this.props.messages ? this.props.messages[errors[0]] :
       <FormattedMessage id={`${ this.fieldPrefix }.errors.${ errors[0] }`}/>}
    </div>;
  }

  render() {
    const Input = this.props.input;
    const props = this.props.inputProps;

    if (this.props.sharedAttributes) {
      this.props.sharedAttributes.forEach(name => {
        props[name] = this.props.attributes[name];
      });
    }

    if (props) {
      Object.keys(props).forEach(key => {
        if (props[key] && props[key].isFunc) {
          props[key] = props[key].func(this.props.attributes);
        }
      });
    }

    if (_.isFunction(this.props.isHidden) && this.props.isHidden(props)) {
      return null;
    }

    const Wrapper = this.props.wrapInDiv ? DivInputWrapper : LabelInputWrapper;

    return <Wrapper>
      {this.props.showLabel && this.getLabel(props)}
      {this.renderError()}
      <Input
        onChange={this.handleChange.bind(this)}
        value={this.props.attributes[this.props.name]}
        placeholder={this.getPlaceholder(props)}
        {...props}
      />
    </Wrapper>;
  }

}

export {CheckboxInput, TextareaInput};



// WEBPACK FOOTER //
// ./src/main/app/components/_field/Field.js