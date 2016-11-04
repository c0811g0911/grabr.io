import classNames from 'classnames';
import {ImageUpload} from '../../components/_image-upload/ImageUpload';
import {InfiniteScroll} from '../../components/_infinite-scroll/InfiniteScroll';
import {Link} from 'react-router/es6';
import {Paginator} from '../../utils/Paginator';
import React from 'react';
import {AdminBannerListStore} from '../../stores/AdminSequenceStores';
import {AdminContainer} from '../../components/_admin-container/AdminContainer';
import {BannerShape, shapeBanner} from '../../models/BannerModel';
import {BannerStore} from '../../stores/DataStores';
import {connectToStores} from 'fluxible-addons-react';
import {readAdminBannerList, updateAdminBannerListPositions} from '../../actions/AdminBannerActionCreators';
import {Page, Head, Body} from '../../Page';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Alerts} from '../../components/_alerts/Alerts';

const {arrayOf, func} = React.PropTypes;

export const AdminBannerListPage = connectToStores(class extends React.Component {
  static displayName = 'AdminBannerListPage';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired
  };

  static propTypes = {
    adminBannerList: arrayOf(BannerShape).isRequired
  };

  constructor(props) {
    super(props);
    const {adminBannerList} = this.props;
    this.state = {adminBannerList};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.paginator = new Paginator(this.context, {
      pageSize: 30,
      storeName: AdminBannerListStore.storeName,
      action: readAdminBannerList
    });
    this.paginator.reload();

    this.placeholder = document.createElement('li');
    this.placeholder.className = 'placeholder';
  }

  componentWillReceiveProps({adminBannerList}) {
    this.setState({adminBannerList});
  }

  //componentWillUnmount() {
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_SEQUENCE, {sequenceName: AdminBannerListStore.sequenceName});
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
    var adminBannerList = this.state.adminBannerList;
    var from = Number(this.dragged.dataset.id);
    var to = Number(this.over.dataset.id);
    if (from < to) {
      to--;
    }
    if (this.nodePlacement === 'after') {
      to++;
    }
    adminBannerList.splice(to, 0, adminBannerList.splice(from, 1)[0]);
    this.setState({adminBannerList});
    this.context.executeAction(updateAdminBannerListPositions, {
      ids: adminBannerList.map(({id}) => id)
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
    const {adminBannerList} = this.props;
    return <Page>
      <Head>
        <title>Admin banner list</title>
      </Head>
      <Body>
      <div className="h-100 flex-col">
        <NavigationBar/>
        <div className="flex-grow flex-col">
          <AdminContainer className="flex-grow">
            <p>
              <Link className="grabr-button link-unstyled" to="/admin/banners/new">
                Create new banner
              </Link>
            </p>
            <If condition={this.paginator}>
              <InfiniteScroll wrapper={props => <ul className="admin-banners" {...props}
                                                    onDragOver={this.handleDragOver}/>}
                              hasMore={this.paginator.hasMore()}
                              isSyncing={this.paginator.isSyncing()}
                              onScroll={() => {
                                this.paginator.loadMore();
                              }}>
                {adminBannerList.map(({
                  id,
                  image = {},
                  lead = {},
                  redTitle = {},
                  smallTitle = {},
                  targetUrl,
                  title = {}
                }, i) => [
                  <li key={i}
                      data-id={i}
                      draggable="true"
                      onDragEnd={this.handleDragEnd}
                      onDragStart={this.handleDragStart}>
                    <article className="admin-category-preview">
                      <table className="admin-banners__admin-banner">
                        <tbody>
                        <tr className={classNames('admin-banners__admin-banner-text', {
                          'admin-banners__admin-banner-text_empty-required': !title.en
                        })}>
                          <td colSpan="2">
                            <ImageUpload asInput={false} v2={true} value={image}/>
                          </td>
                          <td>
                            <Link to={`/admin/banners/${id}/edit`} className="grabr-button outlined link-unstyled">
                              Edit
                            </Link>
                          </td>
                        </tr>
                        <tr className={classNames('admin-banners__admin-banner-text', {
                          'admin-banners__admin-banner-text_empty-required': !targetUrl
                        })}>
                          <td>Target URL</td>
                          <td>
                            <a href={targetUrl} target="_blank">{targetUrl}</a>
                          </td>
                        </tr>
                        <tr className={classNames('admin-banners__admin-banner-text', {
                          'admin-banners__admin-banner-text_empty-required': !title.en
                        })}>
                          <td>Title [en]</td>
                          <td>{title.en}</td>
                        </tr>
                        <tr className={classNames('admin-banners__admin-banner-text', {
                          'admin-banners__admin-banner-text_empty-required': !title.ru
                        })}>
                          <td>Title [ru]</td>
                          <td>{title.ru}</td>
                        </tr>
                        <tr className={classNames('admin-banners__admin-banner-text', {
                          'admin-banners__admin-banner-text_empty-required': !smallTitle.en
                        })}>
                          <td>Small title [en]</td>
                          <td>{smallTitle.en}</td>
                        </tr>
                        <tr className={classNames('admin-banners__admin-banner-text', {
                          'admin-banners__admin-banner-text_empty-required': !smallTitle.ru
                        })}>
                          <td>Small title [ru]</td>
                          <td>{smallTitle.ru}</td>
                        </tr>
                        <tr className={classNames('admin-banners__admin-banner-text', {
                          'admin-banners__admin-banner-text_empty-required': !redTitle.en
                        })}>
                          <td>Red title [en]</td>
                          <td>{redTitle.en}</td>
                        </tr>
                        <tr className={classNames('admin-banners__admin-banner-text', {
                          'admin-banners__admin-banner-text_empty-required': !redTitle.ru
                        })}>
                          <td>Red title [ru]</td>
                          <td>{redTitle.ru}</td>
                        </tr>
                        <tr className={classNames('admin-banners__admin-banner-text', {
                          'admin-banners__admin-banner-text_empty-required': !lead.en
                        })}>
                          <td>Lead [en]</td>
                          <td>{lead.en}</td>
                        </tr>
                        <tr className={classNames('admin-banners__admin-banner-text', {
                          'admin-banners__admin-banner-text_empty-required': !lead.ru
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
}, [AdminBannerListStore, BannerStore], ({getStore}) => {
  return {
    adminBannerList: getStore(AdminBannerListStore).get().map(shapeBanner)
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/_admin-banner-list/AdminBannerListPage.js