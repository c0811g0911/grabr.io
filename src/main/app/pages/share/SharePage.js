import React from 'react';
import {AccountStore} from '../../stores/AccountStore';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import {Input} from 'react-text-input';
import {AppStore} from '../../stores/AppStore';
import {makeAuthorizedRequest} from '../../utils/ActionUtils';
import {mixpanelPageViewReferral, mixpanelTrackShare} from '../../../3rd-party/mixpanel/MixpanelEvents';
import URI from 'urijs';
import {MakeMoneyWhenYouTravelIcon} from './MakeMoneyWhenYouTravelIcon';
import {FacebookSquareIcon} from '../../../images/FacebookSquareIcon';
import {TwitterIcon} from '../../../images/TwitterIcon';
import {ShareIcon} from '../../../images/ShareIcon';
import {CreditCardIcon} from '../../../images/CreditCardIcon';
import {BagIcon} from '../../../images/BagIcon';
import {DiscountSentIcon} from './DiscountSentIcon';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import {Alerts} from '../../components/_alerts/Alerts';
import './_share.scss';
import {trackPageView} from '../../utils/trackPageView';

if (CLIENT) {
  var Clipboard = require('clipboard');
}

const {func, object} = React.PropTypes;

export class SharePage extends React.Component {
  static displayName = 'SharePage';

  static contextTypes = {
    getStore: func.isRequired,
    executeAction: func.isRequired,
    intl: object.isRequired
  };

  state = {
    email: '',
    error: null,
    popupIsHidden: true
  };

  _getReferralCode() {
    const {getStore} = this.context;
    return getStore(AccountStore).getUser().get('referral_code');
  }

  _createShareUrl = () => {
    return URI.expand('{+host}{/path*}{?query*}', {
      host: 'http://grabr.io',
      path: ['invitation', this._getReferralCode()],
      query: {utm_source: 'sharing_page', utm_campaign: 'referral_program'}
    }).href();
  };

  _createFacebookUrl = () => {
    const u = URI.expand('{+url}{&query*}', {
      url: this._createShareUrl(),
      query: {utm_medium: 'facebook'}
    }).href();
    return URI.expand('{+host}{/path*}{?query*}', {
      host: 'http://www.facebook.com',
      path: ['sharer.php'],
      query: {u}
    }).href();
  };

  _createTwitterUrl = () => {
    const message = this.context.intl.formatMessage({id: 'pages.share.twitter_message'});
    const url = URI.expand('{+url}{&query*}', {
      url: this._createShareUrl(),
      query: {utm_medium: 'twitter'}
    }).href();
    const text = `${ message }${ url }`;
    return URI.expand('{+host}{/path*}{?query*}', {
      host: 'https://twitter.com',
      path: ['intent', 'tweet'],
      query: {text}
    }).href();
  };

  _createClipboardText = () => {
    const message = this.context.intl.formatMessage({id: 'pages.share.copied_text'});
    const text = message.replace(/\{referrer_id}/, this._getReferralCode());
    const url = URI.expand('{+url}{&query*}', {
      url: this._createShareUrl(),
      query: {utm_medium: 'copy_link'}
    }).href();
    return `${ text }${ url }`;
  };

  _onShareFacebook = () => {
    mixpanelTrackShare('Referral', 'Facebook');
    open(this._createFacebookUrl(), '_blank');
  };

  _onShareTwitter = () => {
    mixpanelTrackShare('Referral', 'Twitter');
    open(this._createTwitterUrl(), '_blank');
  };

  _onChangeEmail = ({target: {value: email}}) => {
    this.setState({email, error: null});
  };

  async _postSharings() {
    try {
      const {email} = this.state;
      const query = {
        query: {sharing: {emails: email.split(',')}},
        version: 2
      };
      await makeAuthorizedRequest('post', '/sharings', query, this.context);
      this.setState({email: '', popupIsHidden: false});
    } catch (error) {
      this.setState({error});
    }
  }

  _onShareViaEmail = event => {
    event.preventDefault();
    mixpanelTrackShare('Referral', 'Email');
    this._postSharings();
  };

  _onHidePopup = () => {
    this.setState({popupIsHidden: true});
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    mixpanelPageViewReferral();
    trackPageView(this.context, {path: `/share`});
    new Clipboard('#copy_referral_code', {});
  }

  render() {
    const {popupIsHidden} = this.state;
    const shareEmailPlaceholder = this.context.intl.formatMessage({id: 'pages.share.email_placeholder'});

    return  (
      <Page>
        <Head>
          <title>
            {this.context.intl.formatMessage({id: 'pages.share.document_title'})}
          </title>
        </Head>
        <Body>
          <div className="min-h-100 flex-col">
            <NavigationBar/>
            <div className="flex-grow share">

              <div className={`share__popup ${ popupIsHidden ? 'hidden-xs-up' : '' }`}>
                <div className="container w-100 m-xs-x-1 m-sm-x-0">
                  <div className="row">
                    <div className="col-xs-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                      <div className="panel panel--xs-top-rounded panel--xs-bottom-rounded">
                        <DiscountSentIcon className="m-b-1"/>
                        <h3>
                          <FormattedMessage id="pages.share.sent_title"/>
                        </h3>
                        <div className="text-muted m-b-2">
                          <FormattedMessage id="pages.share.sent_lead"/>
                        </div>
                        <button className="btn btn-primary btn-block m-t-1" onClick={this._onHidePopup}>
                          <FormattedMessage id="shared.ok"/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="container m-xs-b-3">
                <div className="row">
                  <div className="col-xs-12
                          col-md-10 offset-md-1
                          col-lg-12 offset-lg-0">

                    <MakeMoneyWhenYouTravelIcon className="d-block m-b-2 m-x-auto"/>

                    <h4 className="text-xs-center">
                      <FormattedHTMLMessage id="pages.share.title"/>
                    </h4>
                    <hr />

                    <label className="m-t-1">
                      <FormattedMessage id="pages.share.email_label"/>
                    </label>
                    <div className="input-group text-nowrap">
                      <Input className="form-control" placeholder={shareEmailPlaceholder} onChange={this._onChangeEmail}/>
                      <span className="input-group-btn">
                  <button className="btn btn-primary p-sm-x-3" type="button" onClick={this._onShareViaEmail}>
                    <FormattedMessage id="pages.share.email_button"/>
                  </button>
                </span>
                    </div>

                  </div>
                </div>

                <div className="row">

                  <div className="col-xs-12
                          col-sm-6
                          col-md-3 push-md-5
                          col-lg-4 push-lg-4
                          p-xs-t-1">
                    <label className="text-nowrap">
                      <FormattedMessage id="pages.share.social_label"/>
                    </label>
                    <button className="btn btn-block btn--facebook m-b-1" onClick={this._onShareFacebook}>
                      <FacebookSquareIcon className="m-r-1"/>
                      <FormattedMessage id="pages.share.facebook_label"/>
                    </button>
                  </div>

                  <div className="col-xs-12
                          col-sm-6
                          col-md-3 push-md-5
                          col-lg-4 push-lg-4
                          p-sm-t-1">
                    <label className="hidden-xs-down">&nbsp;</label>
                    <button className="btn btn-block btn--twitter" onClick={this._onShareTwitter}>
                      <TwitterIcon className="m-r-1"/>
                      <FormattedMessage id="pages.share.twitter_label"/>
                    </button>
                  </div>

                  <div className="col-xs-12
                          col-md-4 pull-md-5
                          col-lg-4 pull-lg-8
                          p-xs-t-1
                          p-sm-t-0
                          p-md-t-1">
                    <label>
                      <FormattedMessage id="pages.share.share_label"/>
                    </label>
                    <div className="input-group">
                      <Input className="form-control" value={this._getReferralCode()}/>
                      <span className="input-group-btn">
                  <button id="copy_referral_code"
                          className="btn btn-primary"
                          type="button"
                          data-clipboard-text={this._createClipboardText()}>
                    <FormattedMessage id="pages.share.copy_label"/>
                  </button>
                </span>
                    </div>
                  </div>

                </div>

                <div className="row">
                  <div className="col-xs-12
                          col-md-10 offset-md-1
                          col-lg-8  offset-lg-2
                          p-t-1 p-b-1 m-xs-t-1 m-md-t-0
                          share__steps">

                    <div className="flex-row share__steps-item flex-items-center">
                      <div className="share__steps-item-icon flex-row flex-items-center">
                        <ShareIcon />
                      </div>
                      <div className="font-size-sm">
                        <FormattedMessage id="pages.share.step_1"/>
                      </div>
                    </div>
                    <div className="flex-row share__steps-item flex-items-center">
                      <div className="share__steps-item-icon flex-row flex-items-center">
                        <CreditCardIcon />
                      </div>
                      <div className="font-size-sm">
                        <FormattedMessage id="pages.share.step_2"/>
                      </div>
                    </div>
                    <div className="flex-row share__steps-item flex-items-center">
                      <div className="share__steps-item-icon flex-row flex-items-center">
                        <BagIcon />
                      </div>
                      <div className="font-size-sm">
                        <FormattedHTMLMessage id="pages.share.step_3"/>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="row">
                  <div className="col-xs-12 text-xs-center">
                    <a href="/faq#coupons" className="text-primary">
                      <FormattedMessage id="pages.share.learn_more"/>
                    </a>
                  </div>
                </div>

              </div>

            </div>
            <Footer/>
            <Alerts />
          </div>
        </Body>
      </Page>
    );
  }
}



// WEBPACK FOOTER //
// ./src/main/app/pages/share/SharePage.js