import classNames from 'classnames';
import {getImageUrl} from '../../utils/ImageUtils';
import {AppStore} from '../../stores/AppStore';
import {Picture} from '../picture/Picture';
import React from 'react';
import {TagShape} from '../../models/TagModel';
import './_collection-tag-card.scss';

const {func, string} = React.PropTypes;

export class CollectionTagCard extends React.Component {
  static displayName = 'CollectionTagCard';

  static contextTypes = {
    getStore: func.isRequired
  };

  static propTypes = {
    className: string,
    tag: TagShape.isRequired
  };

  render() {
    const {getStore} = this.context;
    const {className, tag: {title, imageUrl}} = this.props;

    return <div className={classNames('collection-tag-card', className)}>
      <Picture model={{src: getImageUrl(imageUrl, {size: 'small'})}} className="collection-tag-card__picture"/>
      <div className="collection-tag-card__title">
        {getStore(AppStore).getTranslation(title)}
      </div>
    </div>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/collection-tag-card/CollectionTagCard.js