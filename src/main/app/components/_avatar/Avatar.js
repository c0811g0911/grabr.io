import React, {PropTypes} from 'react';
import {getImageUrl} from '../../utils/ImageUtils';
import './_avatar.scss';

export class Avatar extends React.Component {
  static displayName = 'Avatar';

  static propTypes = {
    url: PropTypes.string,
    size: PropTypes.string
  };

  static defaultProps = {
    url: null,
    size: null
  };

  renderImage() {
    if (!this.props.url) {
      return null;
    }

    return <img src={getImageUrl(this.props.url, {size: this.props.size})}/>;
  }

  renderPlaceholder() {
    if (this.props.url) {
      return null;
    }

    return <div className="placeholder"/>;
  }

  render() {
    return <div className="grabr-avatar">
      {this.renderImage()}
      {this.renderPlaceholder()}
    </div>;
  }

}



// WEBPACK FOOTER //
// ./src/main/app/components/_avatar/Avatar.js