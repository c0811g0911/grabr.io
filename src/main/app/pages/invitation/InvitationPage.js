import {AccountStore} from '../../stores/AccountStore';
import {connectToStores} from 'fluxible-addons-react';
import {getImageUrl} from '../../utils/ImageUtils';
import {FormattedMessage} from 'react-intl';
import {loginFacebook} from '../../actions/LoginActionCreators';
import {mixpanelPageViewInvitation} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {Link} from 'react-router/es6';
import {Picture} from '../../components/picture/Picture';
import React from 'react';
import {ReferralStore} from '../../stores/SequenceStores';
import {shapeUser, UserShape} from '../../models/UserModel';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Page, Head, Body} from '../../Page';
import './_invitation.scss';
import {getReferrer} from '../../actions/ReferralActions';
import {Alerts} from '../../components/_alerts/Alerts';
import {trackPageView} from '../../utils/trackPageView';

const {bool, func, string, shape, object} = React.PropTypes;

export const InvitationPage = connectToStores(class extends React.Component {
  static displayName = 'InvitationPage';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired,
    routingProps: object
  };

  static propTypes = {
    isGuest: bool.isRequired,
    user: UserShape.isRequired,
    params: shape({
      referralCode: string.isRequired
    })
  };

  componentWillMount() {
    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    const {referralCode} = this.props.params;

    if (CLIENT || !this.context.getStore(ReferralStore).isLoaded()) {
      this.context.executeAction(getReferrer, {referralCode});
    }
  }

  componentDidMount() {
    const {referralCode} = this.props.params;

    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/invitation/${referralCode}`});
    mixpanelPageViewInvitation();
  }

  //componentWillUnmount() {
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_SEQUENCE, {sequenceName: ReferralStore.sequenceName});
  //  });
  //}

  render() {
    const {executeAction} = this.context;
    const {isGuest, user} = this.props;
    const {avatarUrl, firstName} = user;


    let registerBlock;
    if (isGuest) {
      registerBlock = [
        <button key={0} className="btn btn--facebook btn-block m-b-1" onClick={() => {
          executeAction(loginFacebook);
        }}>
          <FormattedMessage id="pages.invitation.connect_with_facebook"/>
        </button>, <Link key={1} to="/signup" className="btn btn-outline-primary btn-block">
          <FormattedMessage id="pages.invitation.register"/>
        </Link>
      ];
    }

    return  (
      <Page>
        <Head>
          <title></title>
        </Head>
        <Body>
          <div className="min-h-100 flex-col">
            <NavigationBar/>
            <div className="bg-primary invitation flex-grow flex-row flex-items-center p-t-1 p-b-3">
              <If condition={this.context.getStore(ReferralStore).isLoaded()}>
                <div className="invitation__panel panel panel--sm-top-rounded panel--sm-bottom-rounded m-x-auto">
                  <Picture model={{src: getImageUrl(avatarUrl, {size: 'medium'})}}
                           className="avatar avatar--xl d-block m-x-auto m-t-2 m-b-1"/>
                  <h4 className="text-black text-xs-center">
                    {firstName} <FormattedMessage id="pages.invitation.invite_is_received"/>
                  </h4>
                  <p className="m-xs-b-3 text-muted text-xs-center">
                    <FormattedMessage id="pages.invitation.create_your_order"/>
                  </p>
                  {registerBlock}
                </div>
              </If>
            </div>
            <Alerts />
          </div>
        </Body>
      </Page>
    );
  }
}, [AccountStore, ReferralStore], ({getStore}) => ({
  isGuest: getStore(AccountStore).isGuest(),
  user: getStore(ReferralStore).get() ? shapeUser(getStore(ReferralStore).get()) : {}
}));



// WEBPACK FOOTER //
// ./src/main/app/pages/invitation/InvitationPage.js