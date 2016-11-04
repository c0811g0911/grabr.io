import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Profile} from '../../components/_profile/Profile';
import {UserStore} from '../../stores/DataStores';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Footer} from '../../components/footer/Footer';
import {Page, Head, Body} from '../../Page';
import './_user.scss';
import {loadUser} from '../../actions/UserActionCreators';
import {Actions} from '../../actions/Constants';
import {Alerts} from '../../components/_alerts/Alerts';
import {trackPageView} from '../../utils/trackPageView';

const {object, func} = React.PropTypes;

export const UserPage = connectToStores(class extends React.Component {
  static displayName = 'UserPage';

  static propTypes = {
    user: object.isRequired,
    params: object.isRequired
  };

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired
  };

  componentWillMount() {
    // temporary crutch/hack so willMount won't be called twice on server side
    if (this.context.routingProps) {
      return;
    }

    const {params: {id}, user} = this.props;

    if (CLIENT || !user.isLoaded()) {
      this.context.executeAction(loadUser, {id});
    }
  }

  componentDidMount() {
    const {params: {id}} = this.props;

    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/users/${id}`});
  }

  //componentWillUnmount() {
  //  const {id} = this.props.params;
  //
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_DATA_ITEM, {id, storeName: UserStore.storeName});
  //  });
  //}

  render() {
    const {user} = this.props;

    return (
      <Page>
        <Head>
          <title>{user.getFullName()}</title>
        </Head>
        <Body>
          <div className="min-h-100 flex-col">
            <NavigationBar/>
            <div className="flex-grow container-fluid w-100 m-md-b-3 m-md-t-3">
              <div className="row">
                <div className="col-xs-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2
                                panel panel--legacy panel--xs-top-rounded panel--xs-bottom-rounded text-black p-a-0"
                >
                  <Profile user={this.props.user}/>
                </div>
              </div>
            </div>
            <Footer/>
            <Alerts />
          </div>
        </Body>
      </Page>
    );
  }
}, [UserStore], ({getStore}, {params: {id}}) => {
  return {
    user: getStore(UserStore).get(id)
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/_user/UserPage.js