import React, {PropTypes} from 'react';
import _ from 'lodash';
import './_money.scss';

export class Money extends React.Component {
  static displayName = 'Money';

  static propTypes = {
    asInput: PropTypes.bool,
    onFocus: PropTypes.func,
    value: PropTypes.any,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    asInput: false,
    value: 0,
    onFocus: () => {
    },
    disabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      value: this.getValue(props)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: this.getValue(nextProps)
    });
  }

  getValue(props) {
    const value = props.value;

    if (!_.isNumber(props.value) || props.value.length === 0) {
      return props.value;
    } else {
      return value / 100;
    }
  }

  handleChange(event) {
    let value = event.target.value;

    value = value.replace(/[^\d]/g, '');

    if (value.length > 0) {
      value = value * 100;
    }

    this.props.onChange(value);
  }

  renderNegative() {
    if (this.state.value >= 0) {
      return null;
    }

    return <span>- </span>;
  }

  render() {
    if (this.props.asInput) {
      return <div className="grabr-money">
        <strong>$</strong>
        <input onFocus={this.props.onFocus.bind(this)}
               onChange={this.handleChange.bind(this)}
               placeholder={this.props.placeholder}
               value={this.state.value}
               disabled={this.props.disabled}/>
      </div>;
    } else {
      if (!_.isNumber(this.props.value)) {
        return null;
      }

      return <div className="grabr-money">
        {this.renderNegative()}
        <strong>$</strong>
        {Math.abs(this.state.value)}
      </div>;
    }
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_money/Money.js