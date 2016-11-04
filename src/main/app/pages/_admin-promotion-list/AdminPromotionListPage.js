import {InfiniteScroll} from '../../components/_infinite-scroll/InfiniteScroll';
import {Link} from 'react-router/es6';
import {Paginator} from '../../utils/Paginator';
import React from 'react';
import {readAdminPromotionListActive, readAdminPromotionListExpired} from '../../actions/AdminPromotionActionCreators';
import {AdminContainer} from '../../components/_admin-container/AdminContainer';
import {AdminPromotionListActiveStore, AdminPromotionListExpiredStore} from '../../stores/AdminSequenceStores';
import {connectToStores} from 'fluxible-addons-react';
import {PromotionShape, shapePromotion} from '../../models/PromotionModel';
import {Page, Head, Body} from '../../Page';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Alerts} from '../../components/_alerts/Alerts';
import './_admin-promotion-list.scss';

const {arrayOf, func} = React.PropTypes;

export const AdminPromotionListPage = connectToStores(class extends React.Component {
  static displayName = 'AdminPromotionListPage';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired
  };

  static propTypes = {
    adminPromotionListActive: arrayOf(PromotionShape),
    adminPromotionListExpired: arrayOf(PromotionShape)
  };

  constructor(props) {
    super(props);
    this.state = {
      tab: 'active'
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.paginatorActive = new Paginator(this.context, {
      pageSize: 30,
      storeName: AdminPromotionListActiveStore.storeName,
      action: readAdminPromotionListActive
    });
    this.paginatorActive.reload();

    this.paginatorExpired = new Paginator(this.context, {
      pageSize: 30,
      storeName: AdminPromotionListExpiredStore.storeName,
      action: readAdminPromotionListExpired
    });
    this.paginatorExpired.reload();
  }

  //componentWillUnmount() {
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_SEQUENCE, {
  //      sequenceName: AdminPromotionListActiveStore.sequenceName
  //    });
  //    context.dispatch(Actions.UNLOAD_SEQUENCE, {
  //      sequenceName: AdminPromotionListExpiredStore.sequenceName
  //    });
  //  });
  //}

  render() {
    const {adminPromotionListActive, adminPromotionListExpired} = this.props;
    return <Page>
      <Head>
        <title>Admin promotion list</title>
      </Head>
      <Body>
      <div className="h-100 flex-col">
        <NavigationBar/>
        <div className="flex-grow flex-col">
          <AdminContainer className="flex-grow">
            <p className="admin-filter">
              <label>
                <input type="radio"
                       name="tab"
                       value="active"
                       checked={this.state.tab === 'active'}
                       onChange={() => this.setState({tab: 'active'})}/>
                Active ({adminPromotionListActive.length})
              </label>
              <label>
                <input type="radio"
                       name="tab"
                       value="expired"
                       checked={this.state.tab === 'expired'}
                       onChange={() => this.setState({tab: 'expired'})}/>
                Expired ({adminPromotionListExpired.length})
              </label>
            </p>
            <p>
              <Link className="grabr-button link-unstyled" to="/admin/promotions/new">
                Create new promocode
              </Link>
            </p>
            <article className="admin-promotion-list">
              <If condition={this.paginatorActive && this.state.tab === 'active'}>
                <InfiniteScroll wrapper="section"
                                hasMore={this.paginatorActive.hasMore()}
                                isSyncing={this.paginatorActive.isSyncing()}
                                onScroll={() => this.paginatorActive.loadMore()}>
                  <table className="admin-promotion-list__table">
                    <thead>
                    <tr>
                      <th>Token</th>
                      <th>Quantity</th>
                      <th>Usage quota</th>
                      <th>Amount</th>
                      <th>Expires at</th>
                      <th />
                    </tr>
                    </thead>
                    <tbody>
                    {adminPromotionListActive.map(({
                      id, token, quantity, expires_at,
                      amount_cents, amount_currency, usage_quota
                    }, i) => <tr key={i}>
                      <td>{token}</td>
                      <td>{quantity}</td>
                      <td>{usage_quota}</td>
                      <td>
                        $ {(amount_cents / 1e2).toFixed(2)}
                      </td>
                      <td>{expires_at}</td>
                      <td>
                        <Link to={`/admin/promotions/${id}/edit`} className="grabr-button outlined link-unstyled">
                          Edit
                        </Link>
                      </td>
                    </tr>)}</tbody>
                  </table>
                </InfiniteScroll>
              </If>
              <If condition={this.paginatorExpired && this.state.tab === 'expired'}>
                <InfiniteScroll wrapper="section"
                                hasMore={this.paginatorExpired.hasMore()}
                                isSyncing={this.paginatorExpired.isSyncing()}
                                onScroll={() => this.paginatorExpired.loadMore()}>
                  <table className="admin-promotion-list__table">
                    <thead>
                    <tr>
                      <th>Token</th>
                      <th>Quantity</th>
                      <th>Usage quota</th>
                      <th>Amount</th>
                      <th>Expires at</th>
                    </tr>
                    </thead>
                    <tbody>
                    {adminPromotionListExpired.map(({
                      id, token, quantity, expires_at,
                      amount_cents, amount_currency, usage_quota
                    }, i) => <tr key={i}>
                      <td>{token}</td>
                      <td>{quantity}</td>
                      <td>{usage_quota}</td>
                      <td>
                        $ {(amount_cents / 1e2).toFixed(2)}
                      </td>
                      <td>{expires_at}</td>
                    </tr>)}</tbody>
                  </table>
                </InfiniteScroll>
              </If>
            </article>
          </AdminContainer>
        </div>
        <Alerts />
      </div>
      </Body>
    </Page>;
  }
}, [AdminPromotionListActiveStore, AdminPromotionListExpiredStore], ({getStore}) => {
  return {
    adminPromotionListActive: getStore(AdminPromotionListActiveStore).get().map(shapePromotion),
    adminPromotionListExpired: getStore(AdminPromotionListExpiredStore).get().map(shapePromotion)
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/_admin-promotion-list/AdminPromotionListPage.js