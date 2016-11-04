import React, {PropTypes} from 'react';
import {Login} from '../../components/_login/Login';
import {changeState} from '../../utils/stateMachines';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Page, Head, Body} from '../../Page';
import {AppStore} from '../../stores/AppStore';
import {Alerts} from '../../components/_alerts/Alerts';
import {trackPageView} from '../../utils/trackPageView';

export class SignupPage extends React.Component {
  static displayName = 'SignUpPage';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/signup`});
    changeState({
      type: 'login_start',
      context: this.context,
      redirectUrl: '/'
    });
  }

  render() {
    return (
      <Page>
        <Head>
          <title>{this.context.intl.formatMessage({id: 'pages.signup.document_title'})}</title>
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
                  <Login mode={'SIGNUP'}/>
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
// ./src/main/app/pages/_signup/SignupPage.js