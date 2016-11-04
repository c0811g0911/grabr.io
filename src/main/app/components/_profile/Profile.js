import React, {PropTypes} from 'react';
import {Link} from 'react-router/es6';
import {simulateUser} from '../../actions/LoginActionCreators';
import {signOut} from '../../actions/AppActionCreators';
import {grantAdmin, revokeAdmin, blockUser, unblockUser} from '../../actions/AdminActionCreators';
import {Rating} from '../_rating/Rating';
import {GrabList} from '../_grab-list/GrabList';
import {Avatar} from '../_avatar/Avatar';
import {FormattedMessage} from 'react-intl';
import {AccountStore} from '../../stores/AccountStore';

export class Profile extends React.Component {
  static displayName = 'Profile';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired
  };

  static propTypes = {
    user: PropTypes.any.isRequired
  };

  // Handlers
  //
  isCurrent() {
    return this.context.getStore(AccountStore).isCurrent(this.props.user);
  }

  isCurrentAdmin() {
    return this.context.getStore(AccountStore).isAdmin();
  }

  handleSignOutClick() {
    this.context.executeAction(signOut, {redirect: true});
  }

  renderTravelerInfo() {
    if (!this.isCurrentAdmin() || this.isCurrent()) {
      return null;
    }

    return <section>
      <p>{this.props.user.get('email') || 'No email'}</p>
      <p>{this.props.user.get('phone') || 'No phone'}</p>
    </section>;
  }

  renderSettingsLink() {
    if (!this.isCurrent()) {
      return null;
    }

    return <Link className="grabr-button outlined link-unstyled icon--legacy-settings" to="/settings">
      <FormattedMessage id="pages.user.settings"/>
    </Link>;
  }

  renderUserGrabs() {
    if (!this.isCurrent()) {
      return null;
    }

    return <GrabList grabs={this.props.grabs}/>;
  }

  renderSignOut() {
    if (!this.isCurrent()) {
      return null;
    }

    return <button className="grabr-button outlined sign-out-button" onClick={this.handleSignOutClick.bind(this)}>
      <FormattedMessage id="pages.user.sign_out"/>
    </button>;
  }

  renderSSNAlert() {
    if (!this.context.getStore(AccountStore).needsSSN()) {
      return null;
    }

    return <p className="ssn-notification">
      <Link className="link-unstyled" to="/settings/identification">
        <FormattedMessage id="pages.user.ssn_alert"/>
      </Link>
    </p>;
  }

  render() {
    const {user} = this.props;

    return (
      <div className="grabr-profile">
        <Avatar url={user.get('avatar_url') || user.get('avatar') && user.get('avatar').get('url')}/>
        <h1>{user.getFullName()}</h1>
        <section className="reviews-preview">
          <Link to={`/users/${user.get('id')}/reviews/consumer`} className="review review-buyer link-unstyled">
            <h4>
              <FormattedMessage id="pages.user.reviews.consumer"/>
            </h4>
            <Rating count={user.get('consumer_rating_count')} value={user.get('consumer_rating')}/>
          </Link>
          <Link to={`/users/${user.get('id')}/reviews/traveler`} className="review review-traveler link-unstyled">
            <h4>
              <FormattedMessage id="pages.user.reviews.traveler"/>
            </h4>
            <Rating count={user.get('grabber_rating_count')} value={user.get('grabber_rating')}/>
          </Link>
        </section>
        {this.renderSSNAlert()}
        <section className="buttons">
          {this.renderSettingsLink()}
          {this.renderSignOut()}
        </section>
        {this.renderTravelerInfo()}
        {!this.isCurrentAdmin() || this.isCurrent() ? null : <div className="simulate">
          <div>
            <button className="grabr-button" onClick={() => {
              this.context.executeAction(simulateUser, {
                id: this.props.user.getId(),
                redirect: true
              });
            }}>
              Login as this user
            </button>
          </div>
          <label onClick={event => {
            event.stopPropagation();
          }}>
            <input type="checkbox" checked={this.props.user.isAdmin()} onChange={event => {
              event.preventDefault();
              this.context.executeAction(event.target.checked ? grantAdmin : revokeAdmin, {
                id: this.props.user.getId()
              });
            }}/>
            admin
          </label>
          <label onClick={event => {
            event.stopPropagation();
          }}>
            <input type="checkbox" checked={this.props.user.isBlocked()} onChange={event => {
              event.preventDefault();
              this.context.executeAction(event.target.checked ? blockUser : unblockUser, {
                id: this.props.user.getId()
              });
            }}/>
            blocked
          </label>
        </div>}
        {this.renderUserGrabs()}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_profile/Profile.js