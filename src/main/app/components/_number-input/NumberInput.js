import React, {PropTypes} from 'react';
import './_number-input.scss';

export class NumberInput extends React.Component {
  static displayName = 'NumberInput';

  static propTypes = {
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    min: PropTypes.number,
    max: PropTypes.number
  };

  static defaultProps = {
    min: 1,
    max: 9
  };

  constructor(props) {
    super(props);
  }

  handleChange(delta) {
    const newValue = this.props.value + delta;
    if (this.props.min && newValue < this.props.min) {
      return;
    }
    if (this.props.max && newValue > this.props.max) {
      return;
    }

    this.props.onChange(newValue);
  }

  renderChangeButton(iconType, delta) {
    return <button type="button" className="transparent" onClick={this.handleChange.bind(this, delta)}>
      <i className={`icon--legacy-${ iconType }`}/>
    </button>;
  }

  render() {
    return <div className="number-input">
      {this.renderChangeButton('minus', -1)}
      {this.props.value}
      {this.renderChangeButton('plus', 1)}
    </div>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_number-input/NumberInput.js