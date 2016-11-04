import React from 'react';
import './_spinner.scss';

const spinnerUrl = require('./images/spinner.png');

export class Spinner extends React.Component {
  static displayName = 'Spinner';

  render() {
    return <div className="grabr-spinner">
      <img src={spinnerUrl}/>
    </div>;
  }

}



// WEBPACK FOOTER //
// ./src/main/app/components/_spinner/Spinner.js