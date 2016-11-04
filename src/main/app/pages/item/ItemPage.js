import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {ItemStore} from '../../stores/DataStores';
import {shapeItem, ItemShape} from '../../models/ItemModel';
import {Page, Head, Body} from '../../Page';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import './_item.scss';
import {AppStore} from '../../stores/AppStore';
import {loadItem} from '../../actions/ItemActionCreators';
import {Actions} from '../../actions/Constants';
import {getImageSize} from '../../utils/ImageUtils';
import {Item} from './Item';
import {FormattedMessage} from 'react-intl';
import {Alerts} from '../../components/_alerts/Alerts';
import {Modal} from "../../components/_modal/Modal";
import {mixpanelPageViewItem} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {trackPageView} from '../../utils/trackPageView';

const {func, object, bool} = React.PropTypes;

export const ItemPage = connectToStores(class extends React.Component {
  static displayName = 'ItemPage';

  static contextTypes = {
    getStore: func.isRequired,
    executeAction: func.isRequired,
    routingProps: object,
    intl: object
  };

  static propTypes = {
    isItemLoaded: bool,
    item: ItemShape.isRequired,
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
    const {id} = this.props.params;

    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/items/${id}`});
  }

  componentWillReceiveProps(newProps) {
    const {id: newId} = newProps.params;
    const {id: oldId} = this.props.params;

    if (newId !== oldId) {
      //this.unloadData(oldId);
      this.loadData(newId);
      window.scrollTo(0, 0);
      trackPageView(this.context, {path: `/items/${newId}`});
    }
  }

  //componentWillUnmount() {
  //  const {id} = this.props.params;
  //  this.unloadData(id);
  //}

  loadData = id => {
    if (CLIENT || !this.context.getStore(ItemStore).get(id).isLoaded()) {
      this.context.executeAction(loadItem, {id}).then(() => {
        if (CLIENT) {
          const {item} = this.props;
          mixpanelPageViewItem(item.id, item.title);
        }
      });
    }
  };

  //unloadData = id => {
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_DATA_ITEM, {id, storeName: ItemStore.storeName});
  //  });
  //};


  render() {
    const {item, isItemLoaded, params: {id}} = this.props;

    return (
      <Page>
        <Head>
          <If condition={isItemLoaded}>
            <title>
              {this.context.intl.formatMessage({id: 'pages.item.document_title'}, {title: item.title})}
            </title>
            <meta name="description" content={item.description}/>
            <meta property="og:type" content="website"/>
            <meta property="og:site_name" content="Grabr"/>
            <meta property="og:title" content={item.title}/>
            <meta property="og:description" content={item.description}/>
            <meta property="og:url" content="https://grabr.io"/>
            <meta property="og:image" content={item.imageUrl}/>

            <meta property="og:image:width" content={getImageSize(item.imageUrl).width}/>
            <meta property="og:image:height" content={getImageSize(item.imageUrl).width}/>
          </If>
        </Head>
        <Body>
          <div className="min-h-100 flex-col">
            <NavigationBar />
            <div className={`flex-grow${isItemLoaded ? '' : ' flex-col'}`}>
              <Choose>
                <When condition={isItemLoaded}>
                  <Item id={id}/>
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
            <Footer />
            <Alerts />
            <Modal />
          </div>
        </Body>
      </Page>
    );
  }
}, [ItemStore], ({getStore}, {params: {id}}) => {
  return {
    isItemLoaded: getStore(ItemStore).get(id).isLoaded(),
    item: shapeItem(getStore(ItemStore).get(id))
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/item/ItemPage.js