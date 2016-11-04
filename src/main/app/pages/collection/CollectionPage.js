import {connectToStores} from 'fluxible-addons-react';
import {GenericScrollBox} from 'react-scroll-box';
import {loadCollectionItems} from '../../actions/CollectionActionCreators';
import {Paginator} from '../../utils/Paginator';
import React from 'react';
import {CollectionItemsStore, CollectionTagsStore} from '../../stores/SequenceStores';
import {CollectionShape, shapeCollection} from '../../models/CollectionModel';
import {CollectionStore} from '../../stores/DataStores';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import './_collection.scss';
import {loadCollection} from '../../actions/CollectionActionCreators';
import {loadCollectionTags} from '../../actions/CollectionActionCreators';
import {Actions} from '../../actions/Constants';
import {Collection} from './Collection';
import {Alerts} from '../../components/_alerts/Alerts';
import {mixpanelPageViewCollection} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {trackPageView} from '../../utils/trackPageView';
import {AppStore} from '../../stores/AppStore';
import {FormattedMessage} from 'react-intl';

const {arrayOf, func, number, object} = React.PropTypes;

function parseTagIds(tagIdsString = '') {
  tagIdsString = decodeURIComponent(tagIdsString);
  return (tagIdsString.match(/\d+/g) || []).map(Number);
}

export const CollectionPage = connectToStores(class extends React.Component {
  static displayName = 'CollectionPage';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired,
    routingProps: object
  };

  static propTypes = {
    params: object.isRequired,
    location: object.isRequired,
    collection: CollectionShape.isRequired,
    tagIds: arrayOf(number.isRequired),
  };

  constructor(props) {
    super(props);
    this.state = {
      showArrowLeft: false,
      showArrowRight: false
    };
  }

  componentWillMount() {
    const {id} = this.props.params;
    const {query: {tagIds}} = this.props.location;

    this.paginator = new Paginator(this.context, {
      pageSize: 24,
      storeName: CollectionItemsStore.storeName,
      action: loadCollectionItems,
      filters: {id, tagIds}
    });

    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    this.loadData(id, parseTagIds(tagIds), true);
  }

  componentDidMount() {
    const {id} = this.props.params;

    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/collections/${id}`});
  }

  componentWillReceiveProps(newProps) {
    const {id: newId} = newProps.params;
    const {id: oldId} = this.props.params;
    const {tagIds: oldTagIds} = this.props.location.query;
    const {tagIds: newTagIds} = newProps.location.query;

    if (newId !== oldId || newTagIds !== oldTagIds) {
      this.unloadData();
      this.loadData(newId, newTagIds, newId !== oldId);
    }
    if (newId !== oldId) {
      trackPageView(this.context, {path: `/collections/${newId}`});
    }
  }

  //componentWillUnmount() {
  //  const {id} = this.props.params;
  //
  //  this.unloadData();
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_DATA_ITEM, {id, storeName: CollectionStore.storeName});
  //  });
  //}

  loadData = (id, tagIds, newPage=false) => {
    this.paginator.filters = {id, tagIds};

    if (CLIENT || !this.context.getStore(CollectionStore).get(id).isLoaded()) {
      this.context.executeAction(loadCollection, {id}).then(() => {
        // send data to mixpanel only on first collection pageView
        if (CLIENT && newPage) {
          const {collection: {id, title: {en}}} = this.props;
          mixpanelPageViewCollection(id, en);
        }
      });
    }

    if (CLIENT || !this.context.getStore(CollectionTagsStore).isLoaded()) {
      this.context.executeAction(loadCollectionTags, {id, tagIds});
    }

    if (CLIENT || !this.context.getStore(CollectionItemsStore).isLoaded()) {
      this.paginator.reload();
    }
  };

  unloadData = () => {
    this.context.executeAction(context => {
      context.dispatch(Actions.UNLOAD_SEQUENCE, {sequenceNames: [
        CollectionTagsStore.sequenceName,
        CollectionItemsStore.sequenceName
      ]});
    });
  };


  render() {
    const {collection, params: {id}, tagIds, isCollectionLoaded} = this.props;
    const {paginator} = this;

    return (
      <Page>
        <Head>
          <If condition={isCollectionLoaded}>
            <title>{this.context.getStore(AppStore).getTranslation(collection.title)}</title>
          </If>
        </Head>
        <Body>
          <div className="min-h-100 flex-col">
            <NavigationBar/>
            <div className="flex-grow flex-col">
              <Choose>
                <When condition={isCollectionLoaded}>
                  <Collection id={id} tagIds={tagIds} paginator={paginator}/>
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
          </div>
        </Body>
      </Page>
    );
  }
}, [CollectionStore, CollectionItemsStore, CollectionTagsStore], ({getStore}, {params: {id}, location: {query: {tagIds}}}) => ({
  collection: shapeCollection(getStore(CollectionStore).get(id)),
  isCollectionLoaded: getStore(CollectionStore).get(id).isLoaded(),
  id: Number(id),
  tagIds: parseTagIds(tagIds)
}));



// WEBPACK FOOTER //
// ./src/main/app/pages/collection/CollectionPage.js