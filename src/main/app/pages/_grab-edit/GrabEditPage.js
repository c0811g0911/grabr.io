import React from 'react';
import {GrabEdit} from '../../components/_grab-edit/GrabEdit';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import {FormStore} from '../../stores/FormStore';
import {loadGrabEditPage} from '../../actions/GrabActionCreators';
import {connectToStores} from 'fluxible-addons-react';
import {resetForm} from '../../actions/FormActionCreators';
import {Alerts} from '../../components/_alerts/Alerts';
import {trackPageView} from '../../utils/trackPageView';
import {FormattedMessage} from 'react-intl';

const {func, object} = React.PropTypes;

export const GrabEditPage = connectToStores(class extends React.Component {
  static displayName = 'GrabEditPage';

  static propTypes = {
    params: object.isRequired
  };

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired,
    routingProps: object,
    intl: object.isRequired
  };

  componentWillMount() {
    const {id} = this.props.params;

    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    if (CLIENT || !this.context.getStore(FormStore).isLoaded()) {
      this.context.executeAction(loadGrabEditPage, {id});
    }
  }

  componentDidMount() {
    const {params: {id}} = this.props;

    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/grabs/${id}/edit`});
  }

  //componentWillUnmount() {
  //  this.context.executeAction(resetForm);
  //}

  render() {
    const {id} = this.props.params;

    return  (
      <Page>
        <Head>
          <title>
            {this.context.intl.formatMessage({id: 'pages.grab_edit.document_title'})}
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
                    <GrabEdit id={id}/>
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
        </div>
        </Body>
      </Page>
    );
  }
}, [FormStore], () => ({}));



// WEBPACK FOOTER //
// ./src/main/app/pages/_grab-edit/GrabEditPage.js