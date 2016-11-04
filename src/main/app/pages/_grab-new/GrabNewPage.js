import React from 'react';
import {GrabCreate} from '../../components/_grab-create/GrabCreate';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import {FormStore} from '../../stores/FormStore';
import {loadNewGrabPage} from '../../actions/GrabActionCreators';
import {connectToStores} from 'fluxible-addons-react';
import {Alerts} from '../../components/_alerts/Alerts';
import {Modal} from '../../components/_modal/Modal';
import {trackPageView} from '../../utils/trackPageView';
import {FormattedMessage} from 'react-intl';

const {func, object, shape} = React.PropTypes;

export const GrabNewPage = connectToStores(class extends React.Component {
  static displayName = 'GrabNewPage';

  static propTypes = {
    location: shape({
      query: object.isRequired
    }).isRequired
  };

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired,
    routingProps: object,
    intl: object.isRequired
  };

  componentWillMount() {
    const {item_id: itemId, quantity, title, url} = this.props.location.query;

    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    if (CLIENT || !this.context.getStore(FormStore).isLoaded()) {
      this.context.executeAction(loadNewGrabPage, {itemId, quantity, title, url, query: this.props.location.query});
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/grabs/new`});
  }

  render() {
    return (
      <Page>
        <Head>
          <title>
            {this.context.intl.formatMessage({id: 'pages.new_grab.document_title'})}
          </title>
        </Head>
        <Body>
          <div className="min-h-100 flex-col">
            <NavigationBar/>
            <Choose>
              <When condition={this.context.getStore(FormStore).isLoaded()}>
                <div className="flex-grow container-fluid w-100 m-md-b-3 m-t-2">
                  <div className="row">
                    <div className="col-xs-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2
                                    panel panel--legacy panel--xs-top-rounded panel--xs-bottom-rounded text-black p-a-0"
                    >
                      <If condition={this.context.getStore(FormStore).isLoaded()}>
                        <GrabCreate />
                      </If>
                    </div>
                  </div>
                </div>
              </When>
              <Otherwise>
                <div className="flex-grow flex-col flex-justify-center flex-items-center">
                  <div>
                    <FormattedMessage id="components.sync.loading"/>
                  </div>
                </div>
              </Otherwise>
            </Choose>
            <Footer/>
            <Alerts />
            <Modal />
          </div>
        </Body>
      </Page>
    );
  }
}, [FormStore], () => ({}));



// WEBPACK FOOTER //
// ./src/main/app/pages/_grab-new/GrabNewPage.js