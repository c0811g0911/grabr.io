import {CollectionCard} from '../../components/collection-card/CollectionCard';
import {connectToStores} from 'fluxible-addons-react';
import {FormattedMessage} from 'react-intl';
import {InfiniteScroll} from '../../components/_infinite-scroll/InfiniteScroll';
import {mixpanelPageViewCollections} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {Paginator} from '../../utils/Paginator';
import React from 'react';
import {CollectionShape, shapeCollection} from '../../models/CollectionModel';
import {
  CollectionsPageStore
} from '../../stores/SequenceStores';
import {
  loadCollections,
} from '../../actions/CollectionActionCreators';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import {loadCollectionsPage} from '../../actions/CollectionActionCreators';
import {AppStore} from '../../stores/AppStore';
import {Actions} from '../../actions/Constants';
import {Alerts} from '../../components/_alerts/Alerts';
import {trackPageView} from '../../utils/trackPageView';

const {arrayOf, func, object} = React.PropTypes;

const typeData = {
  curated: {
    title: 'curated',
    filter: {partnership: 'person'}
  },
  partner: {
    title: 'partner',
    filter: {partnership: 'organization'}
  },
  favorite: {
    title: 'favorite',
    filter: {partnership: 'none'}
  }
};

export const CollectionsPage = connectToStores(class extends React.Component {
  static displayName = 'CollectionsPage';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired,
    routingProps: object,
    intl: object.isRequired
  };

  static propTypes = {
    collections: arrayOf(CollectionShape).isRequired,
    location: object.isRequired
  };

  componentWillMount() {
    const {location: {query: {type}}} = this.props;

    this.paginator = new Paginator(this.context, {
      pageSize: 12,
      storeName: CollectionsPageStore.storeName,
      action: loadCollectionsPage,
      filters: (typeData[type] || typeData['favorite']).filter
    });

    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    if (CLIENT || !this.context.getStore(CollectionsPageStore).isLoaded()) {
      this.paginator.reload();
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/collections`});
    mixpanelPageViewCollections();
  }

  //componentWillUnmount() {
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_SEQUENCE, {sequenceName: CollectionsPageStore.sequenceName});
  //  });
  //}

  render() {
    const {collections, location: {query: {type}}} = this.props;

    return  (
      <Page>
        <Head>
          <title>
            {this.context.intl.formatMessage({id: `pages.collections.${(typeData[type] || typeData['favorite']).title}.title`})}
          </title>
        </Head>
        <Body>
          <div>
            <NavigationBar/>
            <div className="collection">
              <div className="container m-b-3">
                <div className="text-xs-center m-y-2 p-x-1">
                  <h2>
                    <FormattedMessage id={`pages.collections.${(typeData[type] || typeData['favorite']).title}.title`}/>
                  </h2>
                </div>

                <InfiniteScroll wrapper={({children}) => <section className="row m-t-1 p-sm-x-0">{children}</section>}
                                hasMore={this.paginator.hasMore()}
                                isSyncing={this.paginator.isSyncing()}
                                onScroll={() => {
                                  this.paginator.loadMore();
                                }}>
                  {collections.map((collection, key) => <div key={key} className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-1">
                    <CollectionCard collection={collection}/>
                  </div>)}
                </InfiniteScroll>
              </div>
            </div>
            <Footer/>
            <Alerts />
          </div>
        </Body>
      </Page>
    );
  }
}, [
  CollectionsPageStore
], ({getStore}, {location: {query: {type}}}) => ({
  collections: getStore(CollectionsPageStore).get().map(shapeCollection)
}));



// WEBPACK FOOTER //
// ./src/main/app/pages/collections/CollectionsPage.js