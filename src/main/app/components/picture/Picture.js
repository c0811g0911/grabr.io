import React from 'react';
import classNames from 'classnames';
import {PictureShape} from './PictureShape';
import './_picture.scss';

const {oneOfType, arrayOf, string} = React.PropTypes;

export class Picture extends React.Component {

  static propTypes = {
    className: oneOfType([arrayOf(string), string]),
    model: PictureShape
  };

  render() {
    const {className, model: {src, alt}} = this.props;

    return <div className={classNames('picture', className)}>
      <img src={src} alt={alt} className="picture__img"/>
    </div>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/picture/Picture.js