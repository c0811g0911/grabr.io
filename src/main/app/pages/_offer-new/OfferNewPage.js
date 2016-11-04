import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {OfferForm} from '../../components/_offer-form/OfferForm';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import {GrabStore} from '../../stores/DataStores';
import {loadGrab} from '../../actions/GrabActionCreators';
import {AppStore} from '../../stores/AppStore';
import {FormattedMessage} from 'react-intl';
import {Alerts} from '../../components/_alerts/Alerts';
import {Modal} from '../../components/_modal/Modal';
import {mixpanelPageViewOfferCreation} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {trackPageView} from '../../utils/trackPageView';

const {object, bool, func} = React.PropTypes;

export const OfferNewPage = connectToStores(class extends React.Component {
  static displayName = 'NewOfferPage';

  static contextTypes = {
    getStore: func.isRequired,
    executeAction: func.isRequired,
    intl: object.isRequired
  };

  static propTypes = {
    grab: object,
    isGrabLoaded: bool,
    params: object.isRequired
  };

  componentWillMount() {
    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    const {params: {id}, isGrabLoaded} = this.props;

    if (CLIENT || !isGrabLoaded) {
      this.context.executeAction(loadGrab, {id, loadOffers: true});
    }
  }

  componentDidMount() {
    const {params: {id}} = this.props;
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/grabs/${id}/offers/new`});
    mixpanelPageViewOfferCreation();
  }

  //componentWillUnmount() {
  //  const {id} = this.props.params;
  //
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_DATA_ITEM, {id, storeName: GrabStore.storeName});
  //  });
  //}

  render() {
    const {params: {id}, isGrabLoaded} = this.props;

    return (
      <Page>
        <Head>
          <title>
            {this.context.intl.formatMessage({id: 'pages.grab_offer.document_title'})}
          </title>
        </Head>
        <Body>
        <div className="min-h-100 flex-col">
          <NavigationBar/>
          <div className="flex-grow container-fluid w-100 m-md-b-3 m-md-t-3 m-t-2">
            <h1 className="text-center font-size-xl m-b-2">
              <FormattedMessage id="pages.grab_offer.page_header"/>
            </h1>
            <div className="row">
              <div className="col-xs-12 col-md-8 offset-md-2 col-lg-8 offset-lg-2
                                        panel panel--legacy panel--xs-top-rounded panel--xs-bottom-rounded text-black p-a-0"
              >
                <If condition={isGrabLoaded}>
                  <OfferForm grabId={id}/>
                </If>
              </div>
            </div>
          </div>
          <Footer/>
          <Alerts />
          <Modal />
        </div>
        </Body>
      </Page>
    );
  }
}, [GrabStore], ({getStore}, {params: {id}}) => ({
  isGrabLoaded: getStore(GrabStore).get(id).isLoaded()
}));



// WEBPACK FOOTER //
// ./src/main/app/pages/_offer-new/OfferNewPage.js