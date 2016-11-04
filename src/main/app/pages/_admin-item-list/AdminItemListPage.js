import {InfiniteScroll} from '../../components/_infinite-scroll/InfiniteScroll';
import {Link} from 'react-router/es6';
import {Paginator} from '../../utils/Paginator';
import React from 'react';
import {AdminContainer} from '../../components/_admin-container/AdminContainer';
import {AdminItemListStore} from '../../stores/AdminSequenceStores';
import {amplifyAdminItem, readAdminItemList} from '../../actions/AdminItemActionCreators';
import {connectToStores} from 'fluxible-addons-react';
import {ItemShape, shapeItem} from '../../models/ItemModel';
import {Page, Head, Body} from '../../Page';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Actions} from '../../actions/Constants';
import {Alerts} from '../../components/_alerts/Alerts';

const {arrayOf, func} = React.PropTypes;

export const AdminItemListPage = connectToStores(class extends React.Component {
  static displayName = 'AdminItemListPage';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired
  };

  static propTypes = {
    itemList: arrayOf(ItemShape)
  };

  constructor(props) {
    super(props);
    this.state = {published: true};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.paginator = new Paginator(this.context, {
      pageSize: 30,
      storeName: AdminItemListStore.storeName,
      action: readAdminItemList,
      filters: {published: true}
    });
    this.paginator.reload();
  }

  //componentWillUnmount() {
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_SEQUENCE, {sequenceName: AdminItemListStore.sequenceName});
  //  });
  //}

  render() {
    const {executeAction} = this.context;
    const {itemList} = this.props;
    const {published} = this.state;
    return <Page>
      <Head>
        <title>Admin item list</title>
      </Head>
      <Body>
      <div className="h-100 flex-col">
        <NavigationBar/>
        <div className="flex-grow flex-col">
          <AdminContainer className="flex-grow">
            <p className="admin-filter">
              <label>
                <input name="published_filter" type="radio" checked={published} onChange={event => {
                  if (event.target.checked) {
                    this.setState({published: true});
                    this.paginator.applyFilter('published', true);
                  }
                }}/>
                Published
              </label>
              <label>
                <input name="published_filter" type="radio" checked={!published} onChange={event => {
                  if (event.target.checked) {
                    this.setState({published: false});
                    this.paginator.applyFilter('published', false);
                  }
                }}/>
                Unpublished
              </label>
            </p>
            <If condition={this.paginator}>
              <p className="admin-filter-items">
                <span>{this.paginator.getTotalCount() || 0} items</span>
                <span>
                <Link className="grabr-button link-unstyled" to="/admin/items/new">
                  Create by hand
                </Link>
                <Link className="grabr-button link-unstyled" to="/admin/items/new/url">
                  Create from url
                </Link>
              </span>
              </p>
              <InfiniteScroll wrapper="ul"
                              hasMore={this.paginator.hasMore()}
                              isSyncing={this.paginator.isSyncing()}
                              onScroll={() => {
                                this.paginator.loadMore();
                              }}>
                {itemList.map((item, i) => {
                  const {id, imageUrl, title} = item;
                  return <li key={i}>
                    <article className="admin-item-preview">
                      <div>
                        <h3>{title}</h3>
                        <button className="grabr-button" onClick={() => {
                          executeAction(amplifyAdminItem, {id});
                        }}>
                          Raise
                        </button>
                        <Link className="grabr-button outlined link-unstyled" to={`/admin/items/${id}/edit`}>
                          Edit
                        </Link>
                      </div>
                      <div className="image">
                        <img src={imageUrl}/>
                      </div>
                    </article>
                  </li>;
                })}
              </InfiniteScroll>
            </If>
          </AdminContainer>
        </div>
        <Alerts />
      </div>
      </Body>
    </Page>;
  }
}, [AdminItemListStore], ({getStore}) => {
  return {
    itemList: getStore(AdminItemListStore).get().map(shapeItem)
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/_admin-item-list/AdminItemListPage.js