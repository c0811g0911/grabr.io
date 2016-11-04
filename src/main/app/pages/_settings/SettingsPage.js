import React, {PropTypes} from 'react';
import {Link} from 'react-router/es6';
import {intercomOpenChat} from '../../utils/IntercomUtils';
import {FormattedMessage} from 'react-intl';
import {AccountStore} from '../../stores/AccountStore';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import {AppStore} from '../../stores/AppStore';
import {Alerts} from '../../components/_alerts/Alerts';
import {trackPageView} from '../../utils/trackPageView';

export class SettingsPage extends React.Component {
  static displayName = 'SettingsPage';

  static contextTypes = {
    getStore: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/settings`});
  }

  isTraveler() {
    return this.context.getStore(AccountStore).isTraveler();
  }

  isVerified() {
    return this.context.getStore(AccountStore).isVerified();
  }

  renderPayout() {
    if (!this.isTraveler()) {
      return null;
    }

    return <li className="grabr-row">
      <Link to="/settings/payout" className="link-unstyled">
        <FormattedMessage id="pages.settings.payout"/>
      </Link>
    </li>;
  }

  renderIdentification() {
    if (!this.isVerified()) {
      return null;
    }

    return (
      <li className="grabr-row">
        <Link to="/settings/identification" className="link-unstyled">
          <FormattedMessage id="pages.settings.identification"/>
        </Link>
      </li>
    );
  }

  render() {
    return (
      <Page>
        <Head>
          <title>
            {this.context.intl.formatMessage({id: 'pages.settings.document_title'})}
          </title>
        </Head>
        <Body>
          <div className="min-h-100 flex-col">
            <NavigationBar/>
            <div className="container-fluid w-100 m-md-b-3 m-t-2">
              <h1 className="text-center font-size-xl m-b-2">
                <FormattedMessage id="pages.settings.page_header"/>
              </h1>
              <div className="row">
                <div className="col-xs-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2
                                    panel panel--legacy panel--xs-top-rounded panel--xs-bottom-rounded text-black p-a-0"
                >
                  <ul className="m-b-0">
                    <li className="grabr-row">
                      <Link to="/settings/personal" className="link-unstyled">
                        <FormattedMessage id="pages.settings.personal"/>
                      </Link>
                    </li>
                    <li className="grabr-row">
                      <Link to="/settings/email" className="link-unstyled">
                        <FormattedMessage id="pages.settings.email"/>
                      </Link>
                    </li>
                    <li className="grabr-row">
                      <Link to="/settings/phone" className="link-unstyled">
                        <FormattedMessage id="pages.settings.phone"/>
                      </Link>
                    </li>
                    <li className="grabr-row">
                      <Link to="/coupons" className="link-unstyled">
                        <FormattedMessage id="pages.settings.coupons"/>
                      </Link>
                    </li>
                    <li className="grabr-row">
                      <Link to="share" className="link-unstyled">
                        <FormattedMessage id="pages.settings.share"/>
                      </Link>
                    </li>
                    <li className="grabr-row">
                      <Link to="/settings/payment" className="link-unstyled">
                        <FormattedMessage id="pages.settings.payment"/>
                      </Link>
                    </li>
                    {this.renderPayout()}
                    {this.renderIdentification()}
                    <li className="grabr-row">
                      <Link to="/settings/traveler-notifications" className="link-unstyled">
                        <FormattedMessage id="pages.settings.notifications"/>
                      </Link>
                    </li>
                    <li className="grabr-row">
                      <Link to="/settings/sms-notifications" className="link-unstyled">
                        <FormattedMessage id="pages.settings.sms_notifications"/>
                      </Link>
                    </li>
                    <section className="profile-more">
                      <h4 className="header-caps">
                        <FormattedMessage id="pages.settings.more"/>
                      </h4>
                      <ul>
                        <li className="grabr-row">
                          <a href="http://grabr.io/blog" className="link-unstyled">
                            <FormattedMessage id="pages.settings.blog"/>
                          </a>
                        </li>
                        <li className="grabr-row">
                          <Link className="link-unstyled" to="/faq">
                            <FormattedMessage id="pages.settings.faq"/>
                          </Link>
                        </li>
                        <li className="grabr-row">
                          <Link className="link-unstyled" to="/terms">
                            <FormattedMessage id="pages.settings.terms"/>
                          </Link>
                        </li>
                        <li className="grabr-row">
                          <Link className="link-unstyled" to="/privacy">
                            <FormattedMessage id="pages.settings.privacy"/>
                          </Link>
                        </li>
                        <li className="grabr-row">
                          <a href="#" className="link-unstyled" onClick={event => {
                            event.preventDefault();
                            intercomOpenChat();
                          }}>
                            <FormattedMessage id="pages.settings.help"/>
                          </a>
                        </li>
                      </ul>
                    </section>
                  </ul>
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
// ./src/main/app/pages/_settings/SettingsPage.js