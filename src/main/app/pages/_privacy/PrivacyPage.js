import React from 'react';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import {Page, Head, Body} from '../../Page';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {AppStore} from '../../stores/AppStore';
import {Alerts} from '../../components/_alerts/Alerts';
import {trackPageView} from '../../utils/trackPageView';

const {func, object} = React.PropTypes;

export class PrivacyPage extends React.Component {
  static displayName = 'PrivacyPage';

  static contextTypes = {
    getStore: func.isRequired,
    intl: object.isRequired
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/settings/privacy`});
  }

  render() {
    return (
      <Page>
        <Head>
          <title>
            {this.context.intl.formatMessage({id: 'pages.privacy.document_title'})}
          </title>
        </Head>
        <Body>
        <div>
          <NavigationBar/>
          <div className="container-fluid w-100 m-md-b-3 m-md-t-3 m-t-2">
            <h1 className="text-center font-size-xl m-b-2">
              <FormattedMessage id="pages.privacy.page_header"/>
            </h1>
            <div className="row">
              <div className="col-xs-12 col-md-8 offset-md-2 col-lg-8 offset-lg-2
                                    panel panel--legacy panel--xs-top-rounded panel--xs-bottom-rounded text-black p-sm-a-3"
              >
                <div className="static-content">
                  <FormattedHTMLMessage id="pages.privacy.content"/>
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
// ./src/main/app/pages/_privacy/PrivacyPage.js