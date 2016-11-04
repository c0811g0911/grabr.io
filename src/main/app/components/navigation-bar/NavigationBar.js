import React from 'react';
import {Link} from 'react-router';
import {GrabrLogoIcon} from '../../../images/GrabrLogoIcon';
import {NavigationHamburgerIcon} from './images/NavigationHamburgerIcon';
import {NavigationDeliverIcon} from './images/NavigationDeliverIcon';
import {NavigationShopIcon} from './images/NavigationShopIcon';
import {NavigationMessagesIcon} from './images/NavigationMessagesIcon';
import {NavigationNotificationsIcon} from './images/NavigationNotificationsIcon';
import {NavigationGiftIcon} from './images/NavigationGiftIcon';
import './_navigation-bar.scss';
import {connectToStores} from 'fluxible-addons-react';
import {Picture} from '../picture/Picture';
import {AccountStore} from '../../stores/AccountStore';
import {LocalStore} from '../../stores/LocalStore';
import {shapeUser, UserShape} from '../../models/UserModel';
import {FormattedMessage} from 'react-intl';
import {signOut} from '../../actions/AppActionCreators';
import {CounterStore} from '../../stores/CounterStore';
import {
  mixpanelClickAllInviteFriendsNavigationBarMenu,
  mixpanelClickAllShopNavigationBarMenu,
  mixpanelClickAllTravelNavigationBarMenu,
  mixpanelClickLandingShopHeader,
  mixpanelClickLandingTravelHeader,
  mixpanelClickShopShopHeader,
  mixpanelClickShopTravelHeader,
  mixpanelClickTravelShopHeader,
  mixpanelClickTravelTravelHeader
} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {getMixpanelClickPage} from '../../../3rd-party/mixpanel/MixpanelGetters';
import {getImageUrl} from '../../utils/ImageUtils';

const {bool, func, number} = React.PropTypes;

export const NavigationBar = connectToStores(class extends React.Component {

  static propTypes = {
    currentUser: UserShape,
    isLoggedIn: bool,
    unreadConversationsCount: number,
    unreadNotificationsCount: number
  };

  static contextTypes = {
    executeAction: func.isRequired
  };

  state = {
    isMenuOpened: false
  };

  componentWillUnmount() {
    this.closeMenu();
  }

  toggleMenu = () => {
    const {isMenuOpened} = this.state;
    document.body.style.overflow = isMenuOpened ? 'auto' : 'hidden';
    this.setState({isMenuOpened: !isMenuOpened});
  };

  closeMenu = () => {
    document.body.style.overflow = 'auto';
    this.setState({isMenuOpened: false});
  };

  render() {
    const {currentUser, isLoggedIn, unreadConversationsCount, unreadNotificationsCount} = this.props;
    const {isMenuOpened} = this.state;

    return (
      <div>
        <div className={'navigation-bar bg-white flex-row flex-justify-between' + (isMenuOpened ? ' navigation-bar--menu-opened' : '') }>
          <div className="flex-row flex-justify-between w-100">
            <div className="flex-row">
              <div className="flex-col flex-justify-center m-x-1">
                <Link to="/" className="link-unstyled text-black">
                  <GrabrLogoIcon className="navigation-bar__logo"/>
                </Link>
              </div>
              <div className="p-x-1 flex-col flex-justify-center">
                <Link to="/shop" className="text-nowrap link-undecorated" onClick={() => {
                  switch (getMixpanelClickPage()) {
                    case 'Landing':
                      mixpanelClickLandingShopHeader();
                      break;
                    case 'Shop':
                      mixpanelClickShopShopHeader();
                      break;
                    case 'Travel':
                      mixpanelClickTravelShopHeader();
                      break;
                  }
                }}>
                  <NavigationShopIcon/>
                  <span className="hidden-sm-down m-l-1">
                    <FormattedMessage id="components.navbar.shop" />
                  </span>
                </Link>
              </div>
              <div className="p-x-1 flex-col flex-justify-center">
                <Link to="/travel" className="text-nowrap link-undecorated" onClick={() => {
                  switch (getMixpanelClickPage()) {
                    case 'Landing':
                      mixpanelClickLandingTravelHeader();
                      break;
                    case 'Shop':
                      mixpanelClickShopTravelHeader();
                      break;
                    case 'Travel':
                      mixpanelClickTravelTravelHeader();
                      break;
                  }
                }}>
                  <NavigationDeliverIcon/>
                  <span className="hidden-sm-down m-l-1">
                    <FormattedMessage id="components.navbar.travel" />
                  </span>
                </Link>
              </div>
            </div>
            <div className="flex-row">
              <If condition={isLoggedIn}>
                <div className="hidden-sm-down p-x-1 flex-col flex-justify-center">
                  <Link className="flex-row link-undecorated text-primary" to="/share">
                    <NavigationGiftIcon />
                    <span className="m-l-1">
                      <FormattedMessage id="components.navbar.share" />
                    </span>
                  </Link>
                </div>
              </If>
              <If condition={!isLoggedIn}>
                <div className="hidden-sm-down p-x-1 flex-col flex-justify-center">
                  <a target="_blank" className="link-undecorated" href="https://grabr.io/blog">
                    <FormattedMessage id="components.navbar.blog" />
                  </a>
                </div>
                <div className="hidden-sm-down p-x-1 flex-col flex-justify-center">
                  <Link className="link-undecorated" to="/signup">
                    <FormattedMessage id="components.navbar.sign_up" />
                  </Link>
                </div>
                <div className="hidden-sm-down p-x-1 flex-col flex-justify-center">
                  <Link className="link-undecorated" to="/login">
                    <FormattedMessage id="components.navbar.log_in" />
                  </Link>
                </div>
              </If>
              <div className="hidden-sm-down p-x-1 flex-col flex-justify-center">
                <Link className="link-undecorated btn btn-primary navigation-bar__order-button" to="/grabs/new">
                  <FormattedMessage id="components.navbar.start_order" />
                </Link>
              </div>
              <If condition={isLoggedIn}>
                <div className="hidden-sm-down p-x-1 flex-col flex-justify-center">
                  <Link to="/notifications" className="text-nowrap link-undecorated hidden-xs-down pos-relative">
                    <NavigationNotificationsIcon/>
                    <If condition={unreadNotificationsCount}>
                      <div className="navigation-bar__count-label navigation-bar__count-label--icon">
                        {unreadNotificationsCount}
                      </div>
                    </If>
                  </Link>
                </div>
                <div className="hidden-sm-down p-x-1 flex-col flex-justify-center">
                  <Link to="/conversations" className="text-nowrap link-undecorated hidden-xs-down pos-relative">
                    <NavigationMessagesIcon/>
                    <If condition={unreadConversationsCount}>
                      <div className="navigation-bar__count-label navigation-bar__count-label--icon">
                        {unreadConversationsCount}
                      </div>
                    </If>
                  </Link>
                </div>
                <div className="hidden-sm-down p-a-1 flex-col flex-justify-center">
                  <Link to={`/users/${currentUser.id}`}>
                    <Picture model={{src: getImageUrl(currentUser.avatarUrl, {size: 'tiny'})}} className="avatar"/>
                  </Link>
                </div>
              </If>
              <div className="hidden-md-up p-x-1 flex-col flex-justify-center">
                <button
                  className={`btn-unstyled navigation-bar__menu-button${isMenuOpened ? ' navigation-bar__menu-button--menu-opened' : ''}`}
                  type="button"
                  onClick={this.toggleMenu}
                >
                  <NavigationHamburgerIcon className="m-r-space"/>
                  <If condition={!isMenuOpened && (unreadNotificationsCount + unreadConversationsCount) }>
                    <div className="navigation-bar__count-label navigation-bar__count-label--icon">
                      { unreadNotificationsCount + unreadConversationsCount }
                    </div>
                  </If>
                </button>
              </div>
            </div>
          </div>

          <div
            className={`navigation-bar__overlay${isMenuOpened ? ' navigation-bar__overlay--menu-opened' : ''}`}
            onClick={this.closeMenu}
          />

          <div className="navigation-bar__menu bg-dark text-white p-a-1 flex-col flex-justify-between">
            <div className="flex-rigid">
              <div>
                <If condition={isLoggedIn}>
                  <Link className="link-unstyled flex-row flex-items-center flex-justify-between p-b-1" to={`/users/${currentUser.id}`}>
                    <div>{currentUser.fullName}</div>
                    <Picture model={{src: getImageUrl(currentUser.avatarUrl, {size: 'tiny'})}} className="avatar"/>
                  </Link>
                </If>
                <If condition={!isLoggedIn}>
                  <div className="flex-row flex-items-center flex-justify-around p-b-1">
                    <Link className="link-unstyled" to="/signup">
                      <FormattedMessage id="components.navbar.sign_up" />
                    </Link>
                    <div className="navigation-bar__menu-separator--vertical bg-white"></div>
                    <Link className="link-unstyled" to="/login">
                      <FormattedMessage id="components.navbar.log_in" />
                    </Link>
                  </div>
                </If>
                <div className="navigation-bar__menu-separator bg-white m-b-1"></div>
              </div>
              <div className="m-b-1">
                <Link className="link-undecorated w-100 btn btn-primary navigation-bar__order-button" to="/grabs/new">
                  <FormattedMessage id="components.navbar.start_order"/>
                </Link>
              </div>
              <div className="m-b-1">
                <Link className="link-unstyled flex-row flex-items-center flex-justify-between" to="/shop"
                      onClick={mixpanelClickAllShopNavigationBarMenu}>
                  <FormattedMessage id="components.navbar.shop" />
                  <div className="navigation-bar__menu-icon">
                    <NavigationShopIcon/>
                  </div>
                </Link>
              </div>
              <div className="m-b-1">
                <Link className="link-unstyled flex-row flex-items-center flex-justify-between" to="/travel"
                      onClick={mixpanelClickAllTravelNavigationBarMenu}>
                  <FormattedMessage id="components.navbar.travel" />
                  <div className="navigation-bar__menu-icon">
                    <NavigationDeliverIcon/>
                  </div>
                </Link>
              </div>
              <If condition={isLoggedIn}>
                <div className="m-b-1">
                  <Link className="link-unstyled flex-row flex-items-center flex-justify-between" to="/conversations">
                    <div className="flex-row flex-items-center">
                      <div className="m-r-1">
                        <FormattedMessage id="components.navbar.messages" />
                      </div>
                      <If condition={unreadConversationsCount}>
                        <div className="navigation-bar__count-label">
                          {unreadConversationsCount}
                        </div>
                      </If>
                    </div>
                    <div className="navigation-bar__menu-icon">
                      <NavigationMessagesIcon/>
                    </div>
                  </Link>
                </div>
                <div className="m-b-1">
                  <Link className="link-unstyled flex-row flex-items-center flex-justify-between" to="/notifications">
                    <div className="flex-row flex-items-center">
                      <div className="m-r-1">
                        <FormattedMessage id="components.navbar.notifications" />
                      </div>
                      <If condition={unreadNotificationsCount}>
                        <div className="navigation-bar__count-label">
                          {unreadNotificationsCount}
                        </div>
                      </If>
                    </div>
                    <div className="navigation-bar__menu-icon">
                      <NavigationNotificationsIcon/>
                    </div>
                  </Link>
                </div>
                <div className="m-b-1">
                  <Link className="link-unstyled flex-row flex-items-center flex-justify-between" to="/share"
                        onClick={mixpanelClickAllInviteFriendsNavigationBarMenu}>
                    <FormattedMessage id="components.navbar.share" />
                    <div className="navigation-bar__menu-icon">
                      <NavigationGiftIcon/>
                    </div>
                  </Link>
                </div>
              </If>
            </div>

            <div className="flex-rigid m-t-2">
              <div className="m-b-1">
                <a href="https://itunes.apple.com/us/app/apple-store/id992182861?pt=117798974&ct=side-bar&mt=8"
                   className="link-unstyled"
                   target="_blank">
                  <FormattedMessage id="components.navbar.app"/>
                </a>
              </div>
              <div className="m-b-1">
                <a href="https://grabr.io/blog" className="link-unstyled" target="_blank">
                  <FormattedMessage id="components.navbar.blog"/>
                </a>
              </div>
              <div className="m-b-1">
                <Link to="/faq" className="link-unstyled">
                  <FormattedMessage id="components.navbar.faq"/>
                </Link>
              </div>
              <If condition={isLoggedIn}>
                <div className="m-b-1">
                  <button onClick={() => {
                    this.context.executeAction(signOut, {redirect: true})
                  }} className="btn-unstyled">
                    <FormattedMessage id="components.navbar.log_out"/>
                  </button>
                </div>
              </If>
            </div>
          </div>
        </div>
        <div className="navigation-bar__placeholder"/>
      </div>
    );
  }
}, [AccountStore, CounterStore, LocalStore], ({getStore}) => ({
  currentUser: shapeUser(getStore(AccountStore).getUser()),
  isLoggedIn: getStore(LocalStore).isLoggedIn(),
  unreadConversationsCount: getStore(CounterStore).get('unread_conversations_count'),
  unreadNotificationsCount: getStore(CounterStore).get('unread_notifications_count'),
}));



// WEBPACK FOOTER //
// ./src/main/app/components/navigation-bar/NavigationBar.js