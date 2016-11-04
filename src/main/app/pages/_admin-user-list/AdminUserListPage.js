import {Avatar} from '../../components/_avatar/Avatar';
import {InfiniteScroll} from '../../components/_infinite-scroll/InfiniteScroll';
import {Paginator} from '../../utils/Paginator';
import React from 'react';
import {Typeahead} from '../../components/_typeahead/Typeahead';
import {
  blockUser,
  clearAdminUserSuggestionList,
  grantAdmin,
  readAdminUserList,
  readAdminUserSuggestionList,
  revokeAdmin,
  unblockUser
} from '../../actions/AdminActionCreators';
import {AdminContainer} from '../../components/_admin-container/AdminContainer';
import {AdminUserListStore, AdminUserSuggestionListStore} from '../../stores/AdminSequenceStores';
import {connectToStores} from 'fluxible-addons-react';
import {Link} from 'react-router/es6';
import {shapeUser, UserShape} from '../../models/UserModel';
import URI from 'urijs';
import {pushHistoryState} from '../../actions/HistoryActionCreators';
import {Page, Head, Body} from '../../Page';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Actions} from '../../actions/Constants';
import {Alerts} from '../../components/_alerts/Alerts';

const {arrayOf, bool, func} = React.PropTypes;

export const AdminUserListPage = connectToStores(class extends React.Component {
  static displayName = 'AdminUserListPage';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired
  };

  static propTypes = {
    adminUserList: arrayOf(UserShape),
    adminUserSuggestionList: arrayOf(UserShape),
    adminUserSuggestionListIsSyncing: bool
  };

  constructor(props) {
    super(props);
    this.state = {
      mode: 'browse',
      onlyTravelers: false,
      pageNumber: 0,
      query: ''
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.paginator = new Paginator(this.context, {
      pageSize: 20,
      storeName: AdminUserListStore.storeName,
      action: readAdminUserList
    });
    this.paginator.reload();
  }
  //
  //componentWillUnmount() {
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_SEQUENCE, {sequenceName: AdminUserListStore.sequenceName});
  //  });
  //}

  render() {
    const {executeAction} = this.context;
    const {adminUserList, adminUserSuggestionList, adminUserSuggestionListIsSyncing} = this.props;

    return <Page>
      <Head>
        <title>Admin user list</title>
      </Head>
      <Body>
      <div className="h-100 flex-col">
        <NavigationBar/>
        <div className="flex-grow flex-col">
          <AdminContainer className="flex-grow">
            <p className="admin-filter">
              <label>
                <input type="radio"
                       name="interaction-mode"
                       value="browse"
                       checked={this.state.mode === 'browse'}
                       onChange={() => this.setState({mode: 'browse'})}/>
                Browse
              </label>
              <label>
                <input type="radio"
                       name="interaction-mode"
                       value="search"
                       checked={this.state.mode === 'search'}
                       onChange={() => this.setState({mode: 'search'})}/>
                Search
              </label>
            </p>
            <Choose>
              <When condition={this.state.mode === 'search'}>
                <Typeahead placeholder="User name or email (at least 3 characters)"
                           query={this.state.query}
                           onQueryChange={query => {
                             this.setState({query});
                             if (this._queryTimeout) {
                               clearTimeout(this._queryTimeout);
                             }
                             this._queryTimeout = setTimeout(() => {
                               if (query.length > 2) {
                                 executeAction(readAdminUserSuggestionList, {query});
                               } else {
                                 executeAction(clearAdminUserSuggestionList);
                               }
                             }, .5e3);
                           }}
                           onValueChange={({value: id}) => {
                             if (id) {
                               const url = URI.expand('/users{/id}', {id}).href();
                               this.setState({query: ''});
                               executeAction(clearAdminUserSuggestionList);
                               executeAction(pushHistoryState, [url]);
                             }
                           }}
                           onFocus={() => {
                           }}
                           options={adminUserSuggestionList.map(user => {
                             const {fullName, email, id} = user;
                             return {id, value: `${ fullName }${ email ? ` <${ email }>` : '' }`};
                           })}
                           isSyncing={adminUserSuggestionListIsSyncing}/>
              </When>
              <When condition={this.state.mode === 'browse'}>
                <label>
                  <input type="checkbox"
                         checked={this.state.onlyTravelers}
                         onChange={({target: {checked: onlyTravelers}}) => {
                           this.setState({onlyTravelers});
                           this.paginator.applyFilter('onlyTravelers', onlyTravelers);
                         }}/>
                  Just travelers
                </label>
                <If condition={this.paginator}>
                  <InfiniteScroll wrapper="ul"
                                  hasMore={this.paginator.hasMore()}
                                  isSyncing={this.paginator.isSyncing()}
                                  onScroll={() => {
                                    this.paginator.loadMore();
                                  }}>
                    <p>{this.paginator.getTotalCount()} registered users</p>
                    {adminUserList.map((user, i) => {
                      const {avatarUrl, fullName, id, isAdmin, isBlocked} = user;
                      return <li key={i}>
                        <Link to={`/users/${id}`}>
                          <section>
                            <Avatar url={avatarUrl}/>
                            <div className="client-name">{fullName}</div>
                          </section>
                          <label onClick={event => {
                            event.stopPropagation();
                          }}>
                            <input type="checkbox" checked={isAdmin} onChange={event => {
                              event.preventDefault();
                              const {target: {checked}} = event;
                              if (checked) {
                                executeAction(grantAdmin, {id});
                              } else {
                                executeAction(revokeAdmin, {id});
                              }
                            }}/>
                            admin
                          </label>
                          <label onClick={event => {
                            event.stopPropagation();
                          }}>
                            <input type="checkbox" checked={isBlocked} onChange={event => {
                              const {target: {checked}} = event;
                              event.preventDefault();
                              if (checked) {
                                executeAction(blockUser, {id});
                              } else {
                                executeAction(unblockUser, {id});
                              }
                            }}/>
                            blocked
                          </label>
                        </Link>
                      </li>;
                    })}
                  </InfiniteScroll>
                </If>
              </When>
            </Choose>
          </AdminContainer>
        </div>
        <Alerts />
      </div>
      </Body>
    </Page>;
  }
}, [AdminUserListStore, AdminUserSuggestionListStore], ({getStore}) => {
  const adminUserSuggestionList = getStore(AdminUserSuggestionListStore);
  return {
    adminUserList: getStore(AdminUserListStore).get().map(shapeUser),
    adminUserSuggestionList: adminUserSuggestionList.get().map(shapeUser),
    adminUserSuggestionListIsSyncing: adminUserSuggestionList.getInfo('isSyncing')
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/_admin-user-list/AdminUserListPage.js