import React, {PropTypes} from 'react';
import classNames from 'classnames';
import './_row.scss';

export class Row extends React.Component {
  static displayName = 'Row';

  static propTypes = {
    classNames: PropTypes.object
  };

  static defaultProps = {
    classNames: {}
  };

  getClassName() {
    return classNames(Object.assign({
      'grabr-row': true
    }, this.props.classNames));
  }

  render() {
    return <li className={this.getClassName()}>
      {this.props.children}
    </li>;
  }

}



// WEBPACK FOOTER //
// ./src/main/app/components/_row/Row.js