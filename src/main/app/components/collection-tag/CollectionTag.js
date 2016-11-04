import classNames from 'classnames';
import {AppStore} from '../../stores/AppStore';
import {Link} from 'react-router/es6';
import React from 'react';
import {TagShape} from '../../models/TagModel';
import {TimesIcon} from '../../../images/TimesIcon';
import './_collection-tag.scss';

const {func, string} = React.PropTypes;

export class CollectionTag extends React.Component {

  static contextTypes = {
    getStore: func.isRequired
  };

  static propTypes = {
    className: string.isRequired,
    removeHref: string.isRequired,
    tag: TagShape.isRequired
  };

  render() {
    const {tag, className, removeHref} = this.props;
    const {title} = tag;

    return <div className={classNames('collection-tag', className)}>
      <div className="collection-tag__content">
        {this.context.getStore(AppStore).getTranslation(title)}
      </div>
      <Link to={removeHref} className="collection-tag__delete">
        <TimesIcon />
      </Link>
    </div>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/collection-tag/CollectionTag.js