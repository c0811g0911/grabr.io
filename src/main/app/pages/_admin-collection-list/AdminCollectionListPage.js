import classNames from 'classnames';
import {ImageUpload} from '../../components/_image-upload/ImageUpload';
import {InfiniteScroll} from '../../components/_infinite-scroll/InfiniteScroll';
import {Link} from 'react-router/es6';
import {Paginator} from '../../utils/Paginator';
import React from 'react';
import {AdminCollectionListStore} from '../../stores/AdminSequenceStores';
import {AdminContainer} from '../../components/_admin-container/AdminContainer';
import {CollectionShape, shapeCollection} from '../../models/CollectionModel';
import {CollectionStore} from '../../stores/DataStores';
import {connectToStores} from 'fluxible-addons-react';
import {readAdminCollectionList, updateAdminCollectionListPositions} from '../../actions/AdminCollectionActionCreators';
import {Page, Head, Body} from '../../Page';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Actions} from '../../actions/Constants';
import {Alerts} from '../../components/_alerts/Alerts';

const {arrayOf, func} = React.PropTypes;

export const AdminCollectionListPage = connectToStores(class extends React.Component {
  static displayName = 'AdminCollectionListPage';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired
  };

  static propTypes = {
    adminCollectionList: arrayOf(CollectionShape).isRequired
  };

  constructor(props) {
    super(props);
    const {adminCollectionList} = this.props;
    this.state = {adminCollectionList};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.paginator = new Paginator(this.context, {
      pageSize: 30,
      storeName: AdminCollectionListStore.storeName,
      action: readAdminCollectionList
    });
    this.paginator.reload();

    this.placeholder = document.createElement('li');
    this.placeholder.className = 'placeholder';
  }

  componentWillReceiveProps({adminCollectionList}) {
    this.setState({adminCollectionList});
  }

  //componentWillUnmount() {
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_SEQUENCE, {sequenceName: AdminCollectionListStore.sequenceName});
  //  });
  //}

  handleDragStart = event => {
    this.dragged = event.currentTarget;
    event.dataTransfer.effectAllowed = 'move';

    // Firefox requires calling dataTransfer.setData
    // for the drag to properly work
    event.dataTransfer.setData('text/html', event.currentTarget);
  };

  handleDragEnd = () => {
    this.dragged.style.display = 'block';
    this.dragged.parentNode.removeChild(this.placeholder);

    // Update state
    var adminCollectionList = this.state.adminCollectionList;
    var from = Number(this.dragged.dataset.id);
    var to = Number(this.over.dataset.id);
    if (from < to) {
      to--;
    }
    if (this.nodePlacement === 'after') {
      to++;
    }
    adminCollectionList.splice(to, 0, adminCollectionList.splice(from, 1)[0]);
    this.setState({adminCollectionList});
    this.context.executeAction(updateAdminCollectionListPositions, {
      ids: adminCollectionList.map(({id}) => id)
    });
  };

  handleDragOver = event => {
    event.preventDefault();
    const target = event.target;

    this.dragged.style.display = 'none';
    if (target.className === 'placeholder') {
      return;
    }
    if (target.nodeName !== 'LI') {
      return;
    }
    this.over = target;

    var relY = event.clientY - this.over.offsetTop;
    var height = this.over.offsetHeight / 2;
    var parent = target.parentNode;

    if (relY > height) {
      this.nodePlacement = 'after';
      parent.insertBefore(this.placeholder, target.nextElementSibling);
    } else if (relY < height) {
      this.nodePlacement = 'before';
      parent.insertBefore(this.placeholder, target);
    }
  };

  render() {
    const {adminCollectionList} = this.props;
    return <Page>
      <Head>
        <title>Admin collection list</title>
      </Head>
      <Body>
      <div className="h-100 flex-col">
        <NavigationBar/>
        <div className="flex-grow flex-col">
          <AdminContainer className="flex-grow">
            <p>
              <Link className="grabr-button link-unstyled" to="/admin/collections/new">
                Create new collection
              </Link>
            </p>
            <If condition={this.paginator}>
              <InfiniteScroll wrapper={props => <ul className="admin-collections" {...props}
                                                    onDragOver={this.handleDragOver}/>}
                              hasMore={this.paginator.hasMore()}
                              isSyncing={this.paginator.isSyncing()}
                              onScroll={() => {
                                this.paginator.loadMore();
                              }}>
                {adminCollectionList.map(({description = {}, id, images, lead = {}, title}, i) => [
                  <li key={i}
                      data-id={i}
                      draggable="true"
                      onDragEnd={this.handleDragEnd}
                      onDragStart={this.handleDragStart}>
                    <article className="admin-category-preview">
                      <table className="admin-collections__admin-collection">
                        <tbody>
                        <tr className={classNames('admin-collections__admin-collection-text', {
                          'admin-collections__admin-collection-text_empty-required': !title.en
                        })}>
                          <td colSpan="2">
                            <ImageUpload asInput={false} isMultiple={true} v2={true} value={images}/>
                          </td>
                          <td>
                            <Link to={`/admin/collections/${id}/edit`} className="grabr-button outlined link-unstyled">
                              Edit
                            </Link>
                          </td>
                        </tr>
                        <tr className={classNames('admin-collections__admin-collection-text', {
                          'admin-collections__admin-collection-text_empty-required': !title.en
                        })}>
                          <td>Title [en]</td>
                          <td>{title.en}</td>
                        </tr>
                        <tr className={classNames('admin-collections__admin-collection-text', {
                          'admin-collections__admin-collection-text_empty-required': !title.ru
                        })}>
                          <td>Title [ru]</td>
                          <td>{title.ru}</td>
                        </tr>
                        <tr className={classNames('admin-collections__admin-collection-text', {
                          'admin-collections__admin-collection-text_empty-required': !description.en
                        })}>
                          <td>Description [en]</td>
                          <td>{description.en}</td>
                        </tr>
                        <tr className={classNames('admin-collections__admin-collection-text', {
                          'admin-collections__admin-collection-text_empty-required': !description.ru
                        })}>
                          <td>Description [ru]</td>
                          <td>{description.ru}</td>
                        </tr>
                        <tr className={classNames('admin-collections__admin-collection-text', {
                          'admin-collections__admin-collection-text_empty-optional': !lead.en
                        })}>
                          <td>Lead [en]</td>
                          <td>{lead.en}</td>
                        </tr>
                        <tr className={classNames('admin-collections__admin-collection-text', {
                          'admin-collections__admin-collection-text_empty-optional': !lead.ru
                        })}>
                          <td>Lead [ru]</td>
                          <td>{lead.ru}</td>
                        </tr>
                        </tbody>
                      </table>
                    </article>
                  </li>
                ])}
              </InfiniteScroll>
            </If>
          </AdminContainer>
        </div>
        <Alerts />
      </div>
      </Body>
    </Page>;
  }
}, [AdminCollectionListStore, CollectionStore], ({getStore}) => {
  return {
    adminCollectionList: getStore(AdminCollectionListStore).get().map(shapeCollection)
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/_admin-collection-list/AdminCollectionListPage.js