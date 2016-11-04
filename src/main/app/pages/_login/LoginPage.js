import React from 'react';
import {Login} from '../../components/_login/Login';
import {changeState} from '../../utils/stateMachines';
import {mixpanelPageViewLogin} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Page, Head, Body} from '../../Page';
import {AppStore} from '../../stores/AppStore';
import {Alerts} from '../../components/_alerts/Alerts';
import {trackPageView} from '../../utils/trackPageView';

const {shape, object, func} = React.PropTypes;

export class LoginPage extends React.Component {
  static displayName = 'LoginPage';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired,
    intl: object.isRequired
  };

  static propTypes = {
    location: shape({
      query: object
    }).isRequired
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/login`});
    const {redirect} = this.props.location.query;

    changeState({
      type: 'login_start',
      context: this.context,
      redirectUrl: redirect || '/'
    });
    mixpanelPageViewLogin();
  }

  render() {
    return (
      <Page>
        <Head>
          <title>{this.context.intl.formatMessage({id: 'pages.login.document_title'})}</title>
        </Head>
        <Body>
          <div className="min-h-100 flex-col">
            <NavigationBar/>
            <div className="bg-primary flex-grow flex-row flex-items-center">
              <div className="container w-100">
                <div className="row">
                  <div className="col-xs-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3
                                panel panel--xs-top-rounded panel--xs-bottom-rounded text-black"
                  >
                    <Login mode={'LOGIN'}/>
                  </div>
                </div>
              </div>
            </div>
            <Alerts />
          </div>
        </Body>
      </Page>
    );
  }
}



// WEBPACK FOOTER //
// ./src/main/app/pages/_login/LoginPage.js