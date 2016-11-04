import {InfiniteScroll} from '../../components/_infinite-scroll/InfiniteScroll';
import {Link} from 'react-router/es6';
import {Paginator} from '../../utils/Paginator';
import React from 'react';
import {AdminContainer} from '../../components/_admin-container/AdminContainer';
import {AdminGrabListStore} from '../../stores/AdminSequenceStores';
import {connectToStores} from 'fluxible-addons-react';
import {GRAB_AGGREGATE_STATE, GRAB_STATE, GrabShape, shapeGrab} from '../../models/GrabModel';
import {GrabStore} from '../../stores/DataStores';
import {readAdminGrabList} from '../../actions/AdminActionCreators';
import {map} from 'lodash/collection';
import {renderDate} from '../../helpers/renderDate';
import {Page, Head, Body} from '../../Page';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Actions} from '../../actions/Constants';
import {Alerts} from '../../components/_alerts/Alerts';

const {arrayOf, func} = React.PropTypes;

const STATE = {
  ACTIVE: GRAB_AGGREGATE_STATE.ACTIVE,
  ALL: 'all',
  DRAFT: GRAB_AGGREGATE_STATE.DRAFT,
  FINISHED: GRAB_AGGREGATE_STATE.FINISHED,
  PAID_IN: GRAB_STATE.PAID_IN,
  PAID_OUT: GRAB_STATE.PAID_OUT,
  PENDING: GRAB_AGGREGATE_STATE.PENDING
};

function getStateLabel(state) {
  return {
    [STATE.ACTIVE]: 'Active',
    [STATE.ALL]: 'All',
    [STATE.DRAFT]: 'In drafts',
    [STATE.FINISHED]: 'Finished',
    [STATE.PAID_IN]: 'Paid in',
    [STATE.PAID_OUT]: 'Paid out',
    [STATE.PENDING]: 'Pending'
  }[state];
}

export const AdminGrabListPage = connectToStores(class extends React.Component {
  static displayName = 'AdminGrabListPage';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired
  };

  static propTypes = {
    adminGrabList: arrayOf(GrabShape).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {filter: {state: STATE.ALL}};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.paginator = new Paginator(this.context, {
      pageSize: 30,
      storeName: AdminGrabListStore.storeName,
      action: readAdminGrabList
    });
    this.paginator.reload();
  }

  //componentWillUnmount() {
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_SEQUENCE, {sequenceName: AdminGrabListStore.sequenceName});
  //  });
  //}

  render() {
    const {adminGrabList} = this.props;
    return <Page>
      <Head>
        <title>Admin grab list</title>
      </Head>
      <Body>
      <div className="h-100 flex-col">
        <NavigationBar/>
        <div className="flex-grow flex-col">
          <AdminContainer className="flex-grow">
            <p className="admin-filter">
              {map(STATE, (state, i) => <label key={i}>
                <input type="radio"
                       name="state_filter"
                       value={state}
                       checked={this.state.filter.state === state}
                       onChange={({target: {value: state}}) => {
                         this.setState({filter: {...this.state.filter, state}});
                         if (state === 'ALL') {
                           this.paginator.removeFilter('state');
                         } else {
                           this.paginator.applyFilter('state', state.toLowerCase());
                         }
                       }}/>
                {getStateLabel(state)}
              </label>)}
            </p>
            <If condition={this.paginator}>
              <InfiniteScroll wrapper="ul"
                              hasMore={this.paginator.hasMore()}
                              isSyncing={this.paginator.isSyncing()}
                              onScroll={() => {
                                this.paginator.loadMore();
                              }}>
                <p>{this.paginator.getTotalCount()} grabs</p>
                {adminGrabList.map(({
                  acceptedGrabber, aggregateState, consumer, createdDate, dueDate, id, paidIn, title
                }, i) => <li key={i}>
                  <article>
                    <span className="grab-status">{getStateLabel(aggregateState)}</span>
                    <Link to={`/grabs/${id}`} className="grab-title">
                      {title}
                    </Link>
                    <div className="grab-users">
                  <span>
                    Shopper:
                    <Link to={`/users/${consumer.id}`}>
                      {consumer.fullName}
                    </Link>
                  </span>
                      <If condition={acceptedGrabber}>
                  <span>
                      Traveler:
                      <Link to={`/users/${acceptedGrabber.id}`}>
                        {acceptedGrabber.fullName}
                      </Link>
                    </span>
                      </If>
                    </div>
                    <div className="dates">
                      <If condition={dueDate}>
                        <p>
                          Due date:
                          <span className="grabr-date icon--legacy-calendar">{renderDate(dueDate)}</span>
                        </p>
                      </If>
                      <p>
                        Created at:
                        <span className="grabr-date icon--legacy-calendar">{renderDate(createdDate)}</span>
                      </p>
                      <If condition={paidIn}>
                        <p>
                          Paid in:
                          <span className="grabr-date icon--legacy-calendar">{renderDate(paidIn.moment)}</span>
                        </p>
                      </If>
                    </div>
                  </article>
                </li>)}
              </InfiniteScroll>
            </If>
          </AdminContainer>
        </div>
        <Alerts />
      </div>
      </Body>
    </Page>;
  }
}, [AdminGrabListStore, GrabStore], ({getStore}) => {
  return {
    adminGrabList: getStore(AdminGrabListStore).get().map(shapeGrab)
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/_admin-grab-list/AdminGrabListPage.js