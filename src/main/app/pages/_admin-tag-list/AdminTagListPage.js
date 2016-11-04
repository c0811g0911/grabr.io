import {InfiniteScroll} from '../../components/_infinite-scroll/InfiniteScroll';
import {Link} from 'react-router/es6';
import {Paginator} from '../../utils/Paginator';
import React from 'react';
import {AdminContainer} from '../../components/_admin-container/AdminContainer';
import {AdminTagListStore} from '../../stores/AdminSequenceStores';
import {amplifyAdminTag, readAdminTagList} from '../../actions/AdminTagActionCreators';
import {connectToStores} from 'fluxible-addons-react';
import {TagStore} from '../../stores/DataStores';
import {shapeTag, TagShape} from '../../models/TagModel';
import {Page, Head, Body} from '../../Page';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Actions} from '../../actions/Constants';
import {Alerts} from '../../components/_alerts/Alerts';

const {arrayOf, func} = React.PropTypes;

export const AdminTagListPage = connectToStores(class extends React.Component {
  static displayName = 'AdminTagListPage';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired
  };

  static propTypes = {
    adminTagList: arrayOf(TagShape)
  };

  constructor(props) {
    super(props);
    this.state = {pageNumber: 0};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.paginator = new Paginator(this.context, {
      pageSize: 30,
      storeName: AdminTagListStore.storeName,
      action: readAdminTagList
    });
    this.paginator.reload();
  }

  //componentWillUnmount() {
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_SEQUENCE, {
  //      sequenceName: AdminTagListStore.sequenceName
  //    });
  //  });
  //}

  render() {
    const {executeAction} = this.context;
    const {adminTagList} = this.props;
    return <Page>
      <Head>
        <title>Admin tag list</title>
      </Head>
      <Body>
      <div className="h-100 flex-col">
        <NavigationBar/>
        <div className="flex-grow flex-col">
          <AdminContainer className="flex-grow">
            <If condition={this.paginator}>
              <p>{`${ this.paginator.getTotalCount() } tags`}</p>
              <InfiniteScroll wrapper="ul"
                              hasMore={this.paginator.hasMore()}
                              isSyncing={this.paginator.isSyncing()}
                              onScroll={() => {
                                this.paginator.loadMore();
                              }}>
                <table>
                  <thead>
                  <tr>
                    <th rowSpan="2" className="center">Id</th>
                    <th rowSpan="2" className="center">Image</th>
                    <th rowSpan="2" className="right">Title</th>
                    <th className="left">EN</th>
                    <th rowSpan="2" className="center">
                      <Link to="/admin/tags/new">
                        <button className="grabr-button">New!</button>
                      </Link>
                    </th>
                  </tr>
                  <tr>
                    <th className="left">RU</th>
                  </tr>
                  </thead>
                  <tbody>
                  {adminTagList.map(({id, title: {en, ru}, imageUrl}, i) => [
                    <tr key={i}>
                      <td rowSpan="2" className="center">{id}</td>
                      <td rowSpan="2" className="center">
                        <img src={imageUrl} alt={en}/>
                      </td>
                      <td colSpan="2" className="left">{en}</td>
                      <td rowSpan="2" className="center">
                        <button className="grabr-button" onClick={() => {
                          executeAction(amplifyAdminTag, {id});
                        }}>
                          Raise
                        </button>
                        <Link to={`/admin/tags/${id}/edit`}>
                          <button className="grabr-button">Edit</button>
                        </Link>
                      </td>
                    </tr>, <tr key={`${ id }-2`}>
                      <td colSpan="2" className="left">{ru}</td>
                    </tr>
                  ])}</tbody>
                </table>
              </InfiniteScroll>
            </If>
          </AdminContainer>
        </div>
        <Alerts />
      </div>
      </Body>
    </Page>;
  }
}, [AdminTagListStore, TagStore], ({getStore}) => {
  return {
    adminTagList: getStore(AdminTagListStore).get().map(shapeTag)
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/_admin-tag-list/AdminTagListPage.js