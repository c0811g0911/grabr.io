import React, {PropTypes} from 'react';
import './_toggled-input.scss';

export class ToggledInput extends React.Component {
  static displayName = 'ToggledInput';

  static propTypes = {
    defaultValue: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      showInput: !!props.value
    };
  }

  toggleInput() {
    if (this.state.showInput) {
      this.setState({showInput: false});
      this.props.onChange(null);
    } else {
      this.setState({showInput: true});
      this.props.onChange(this.props.defaultValue);
    }
  }

  render() {
    const Input = this.props.input;

    return <div className="toggled-input">
      <button type="button" className={this.state.showInput ? 'minus' : 'plus'} onClick={this.toggleInput.bind(this)}>
      </button>
      {!this.state.showInput && this.props.label}
      {this.state.showInput && <Input {...this.props} />}
    </div>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_toggled-input/ToggledInput.js