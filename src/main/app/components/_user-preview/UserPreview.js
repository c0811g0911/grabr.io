import React, {PropTypes} from 'react';
import classNames from 'classnames';
import {Avatar} from '../_avatar/Avatar';
import {Rating} from '../_rating/Rating';
import {Link} from 'react-router/es6';
import './_user-preview.scss';

export class UserPreview extends React.Component {
  static displayName = 'UserPreview';

  static propTypes = {
    user: PropTypes.any.isRequired,
    onlyAvatar: PropTypes.bool,
    withRating: PropTypes.bool,
    ratingType: PropTypes.oneOf(['grabber', 'consumer']),
    size: PropTypes.string
  };

  static defaultProps = {
    onlyAvatar: false,
    withRating: false,
    ratingType: 'grabber',
    size: 'tiny'
  };

  getClassNames() {
    return classNames({
      'user-preview': true,
      'link-unstyled': true,
      'only-avatar': this.props.onlyAvatar
    });
  }

  renderInfo() {
    if (this.props.onlyAvatar) {
      return null;
    }

    const {user} = this.props;

    if (!this.props.withRating) {
      return <strong>{user.getName()}</strong>;
    } else {
      return <div>
        {user.getName()}
        <Rating value={user.get(this.props.ratingType + '_rating')}
                count={user.get(this.props.ratingType + '_rating_count')}/>
      </div>;
    }
  }

  render() {
    const {user} = this.props;

    return <Link className={this.getClassNames()} to={`/users/${user.get('id')}`}>
      <Avatar url={user.get('avatar') ? user.get('avatar').get('url') : user.get('avatar_url')} size={this.props.size}/>
      {this.renderInfo()}
    </Link>;
  }

}



// WEBPACK FOOTER //
// ./src/main/app/components/_user-preview/UserPreview.js