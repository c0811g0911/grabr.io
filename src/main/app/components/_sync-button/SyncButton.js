import React, {PropTypes} from 'react';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';

export class SyncButton extends React.Component {
  static displayName = 'SyncButton';

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    isDefaultButton: PropTypes.bool,
    isSyncing: PropTypes.bool,
    onClick: PropTypes.func
  };

  static defaultProps = {
    className: '',
    isDefaultButton: true,
    isSyncing: false,
    onClick: function () {
    }
  };

  handleClick(event) {
    this.props.onClick(event);
  }

  getClassName() {
    return classNames({
      'grabr-button': this.props.isDefaultButton,
      [this.props.className]: !!this.props.className,
      syncing: this.props.isSyncing
    });
  }

  renderText() {
    if (this.props.isSyncing) {
      return <FormattedMessage id="components.sync.loading"/>;
    } else {
      return this.props.children;
    }
  }

  render() {
    return <button id={this.props.id}
                   className={this.getClassName()}
                   disabled={this.props.isSyncing}
                   onClick={this.handleClick.bind(this)}
                   type={this.props.type}>
      {this.renderText()}
    </button>;
  }

}



// WEBPACK FOOTER //
// ./src/main/app/components/_sync-button/SyncButton.js