import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {GrabActivePageBody} from './GrabActivePageBody';
import {GrabDefaultPageBody} from './GrabDefaultPageBody';
import {GrabStore} from '../../stores/DataStores';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import {loadGrab} from '../../actions/GrabActionCreators';
import {Actions} from '../../actions/Constants';
import {AppStore} from '../../stores/AppStore';
import {getImageSize} from '../../utils/ImageUtils';
import {shapeGrab} from '../../models/GrabModel';
import {FormattedMessage} from 'react-intl';
import {Alerts} from '../../components/_alerts/Alerts';
import {Modal} from "../../components/_modal/Modal";
import {mixpanelPageViewGrab} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {trackPageView} from '../../utils/trackPageView';

const {bool, object, func} = React.PropTypes;

export const GrabPage = connectToStores(class extends React.Component {
  static displayName = 'GrabPage';

  static contextTypes = {
    getStore: func.isRequired,
    executeAction: func.isRequired,
    routingProps: object,
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

    const {id} = this.props.params;
    this.loadData(id);
  }

  componentDidMount() {
    const {params: {id}} = this.props;

    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/grabs/${id}`});
  }

  componentWillReceiveProps(newProps) {
    const {id: newId} = newProps.params;
    const {id: oldId} = this.props.params;

    if (newId !== oldId) {
      //this.unloadData(oldId);
      this.loadData(newId);
      window.scrollTo(0, 0);
      trackPageView(this.context, {path: `/grabs/${newId}`});
    }
  }

  loadData = id => {
    if (CLIENT || !this.context.getStore(GrabStore).get(id).isLoaded()) {
      this.context.executeAction(loadGrab, {id, loadOffers: true}).then(() => {
        if (CLIENT) {
          const {grab} = this.props;
          mixpanelPageViewGrab(grab.get('id'), grab.get('title'));
        }
      });
    }
  };

  //unloadData = id => {
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_DATA_ITEM, {id, storeName: GrabStore.storeName});
  //  });
  //};

  render() {
    const {grab, isGrabLoaded} = this.props;

    const {imageUrl, title} = shapeGrab(grab);

    return (
      <Page>
        <Head>
          <If condition={isGrabLoaded}>
            <title>
              {this.context.intl.formatMessage({id: 'pages.grab.document_title'}, {title})}
            </title>
            <meta name="description" content={this.context.intl.formatMessage({id: 'pages.grab.document_description'})}/>
            <meta property="og:type" content="website"/>
            <meta property="og:site_name" content="Grabr"/>
            <meta property="og:title" content={this.context.intl.formatMessage({id: 'pages.grab.document_title'}, {title})}/>
            <meta property="og:description" content={this.context.intl.formatMessage({id: 'pages.grab.document_description'})}/>
            <meta property="og:url" content="https://grabr.io"/>
            <meta property="og:image" content={imageUrl}/>

            <meta property="og:image:width" content={getImageSize(imageUrl).width}/>
            <meta property="og:image:height" content={getImageSize(imageUrl).width}/>
          </If>
        </Head>
        <Body>
          <div className="min-h-100 flex-col">
            <NavigationBar/>
            <div className={`flex-grow flex-col`}>
              <Choose>
                <When condition={isGrabLoaded}>
                  <Choose>
                    <When condition={grab.isActive() || grab.isFinished()}>
                      <GrabActivePageBody grab={grab}/>
                    </When>
                    <Otherwise>
                      <GrabDefaultPageBody id={grab.get('id')}/>
                    </Otherwise>
                  </Choose>
                </When>
                <Otherwise>
                  <div className="flex-grow flex-col flex-justify-center flex-items-center">
                    <div>
                      <FormattedMessage id="components.sync.loading"/>
                    </div>
                  </div>
                </Otherwise>
              </Choose>
            </div>
            <Footer/>
            <Alerts />
            <Modal />
          </div>
        </Body>
      </Page>
    );
  }
}, [GrabStore], ({getStore}, {params: {id}}) => {
  return {
    grab: getStore(GrabStore).get(id),
    isGrabLoaded: getStore(GrabStore).get(id).isLoaded()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/grab/GrabPage.js