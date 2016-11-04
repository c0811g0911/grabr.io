import React from 'react';
import './_phone-input.scss';

export class PhoneInput extends React.Component {
  static displayName = 'PhoneInput';

  handleChange(event) {
    this.props.onChange(event.target.value);
  }

  renderPrefix() {
    return <span>{"+"}</span>;
  }

  render() {
    return <div className="grabr-phone-input">
      {this.renderPrefix()}
      <input {...this.props} onChange={this.handleChange.bind(this)}/>
    </div>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_phone-input/PhoneInput.js