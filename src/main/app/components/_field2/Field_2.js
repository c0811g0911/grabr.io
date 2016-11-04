import React, {PropTypes} from 'react';
import _ from 'lodash';
import {updateAttributes} from '../../actions/FormActionCreators';
import {AppStore} from '../../stores/AppStore';
import {FormattedMessage} from 'react-intl';

class TextareaInput extends React.Component {
  static displayName = 'TextareaInput';

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    asInput: PropTypes.bool.isRequired
  };

  static defaultProps = {
    asInput: true
  };

  handleChange(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    if (this.props.asInput) {
      return <textarea {...this.props} onChange={this.handleChange.bind(this)}/>;
    } else {
      return <p className="read-only">{this.props.value}</p>;
    }
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
    onChange: PropTypes.func.isRequired,
    asInput: PropTypes.bool.isRequired
  };

  static defaultProps = {
    asInput: true
  };

  handleChange(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    if (this.props.asInput) {
      return <input {...this.props} onChange={this.handleChange.bind(this)}/>;
    } else {
      return <p className="read-only">{this.props.value}</p>;
    }
  }
}

class DivInputWrapper extends React.Component {
  static displayName = 'DivInputWrapper';

  render() {
    return <div className={`grabr-input ${ this.props.className }`}>
      {this.props.children}
    </div>;
  }
}

class LabelInputWrapper extends React.Component {
  static displayName = 'LabelInputWrapper';

  render() {
    return <label className={`grabr-input ${ this.props.className }`}>
      {this.props.children}
    </label>;
  }
}

export class Field extends React.Component {
  static displayName = 'Field';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  static propTypes = {
    labelText: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    errors: PropTypes.object.isRequired,
    attributes: PropTypes.object.isRequired,
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    input: PropTypes.any,
    inputProps: PropTypes.object,
    wrapInDiv: PropTypes.bool
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
    this.state = {
      value: props.attributes[props.name]
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({value: newProps.attributes[newProps.name]});
  }

  handleChange(value) {
    this.setState({value});
    this.context.executeAction(updateAttributes, {[this.props.name]: value});
  }

  getPlaceholder(props) {
    if (this.props.placeholder) {
      return _.isFunction(this.props.placeholder) ? this.props.placeholder(props) : this.props.placeholder;
    }
    const messages = this.context.getStore(AppStore).getCurrentIntlMessages();
    const placeholderKey = _.isFunction(this.props.placeholderKey) ? this.props.placeholderKey(props) : 'placeholder';

    return messages[`${ this.fieldPrefix }.${ placeholderKey }`];
  }

  getLabel(props) {
    if (this.props.label) {
      return this.props.label;
    }
    const labelKey = _.isFunction(this.props.labelKey) ? this.props.labelKey(props) : 'label';
    return <FormattedMessage id={`${this.fieldPrefix}.${labelKey}`} />;
  }

  renderError() {
    const errors = this.props.errors[this.props.name];

    if (!errors || errors.length === 0) {
      return null;
    }

    return <div className="grabr-error">
      {this.props.messages ? this.props.messages[errors[0]] : <FormattedMessage id={`${this.fieldPrefix}.errors.${ errors[0] }`} /> }
    </div>;
  }

  renderDescription() {
    if (!this.props.description) {
      return null;
    }
    const messages = this.context.getStore(AppStore).getCurrentIntlMessages();

    return (
      <div className="input-description">
        {messages[`${ this.fieldPrefix }.description`]}
      </div>
    );
  }

  render() {
    const Input = this.props.input;
    const props = {...this.props.inputProps};

    if (props) {
      Object.keys(props).forEach(key => {
        if (props[key] && props[key].isFunc) {
          props[key] = props[key].func(this.props.attributes);
        }
      });
    }

    if (_.isFunction(this.props.isHidden) && this.props.isHidden(this.props.attributes)) {
      return null;
    }

    const Wrapper = this.props.wrapInDiv ? DivInputWrapper : LabelInputWrapper;

    return <Wrapper className={`grabr-input-${ this.props.name }`}>
      {this.props.showLabel && this.getLabel(props)}
      {this.renderError()}
      {this.renderDescription()}
      <Input onChange={this.handleChange.bind(this)}
             value={this.state.value}
             label={this.getLabel(props)}
             placeholder={this.getPlaceholder(props)} {...props} />
    </Wrapper>;
  }

}

export {CheckboxInput, TextareaInput};



// WEBPACK FOOTER //
// ./src/main/app/components/_field_2/Field_2.js