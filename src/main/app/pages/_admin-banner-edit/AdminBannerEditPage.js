import React from 'react';
import {Actions} from '../../actions/Constants';
import {AdminBannerForm} from '../../components/_admin-banner-form/AdminBannerForm';
import {AdminContainer} from '../../components/_admin-container/AdminContainer';
import {BannerStore} from '../../stores/DataStores';
import {Body, Head, Page} from '../../Page';
import {connectToStores} from 'fluxible-addons-react';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {readAdminBanner} from '../../actions/AdminBannerActionCreators';
import {Alerts} from '../../components/_alerts/Alerts';

const {string, func, shape} = React.PropTypes;

export const AdminBannerEditPage = connectToStores(class extends React.Component {
  static displayName = 'AdminBannerEditPage';

  static propTypes = {
    params: shape({id: string.isRequired}).isRequired
  };

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    const {id} = this.props.params;
    this.context.executeAction(readAdminBanner, {id});
  }

  //componentWillUnmount() {
  //  const {id} = this.props.params;
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_DATA_ITEM, {id, storeName: BannerStore.storeName});
  //  });
  //}

  render() {
    const {id} = this.props.params;
    return <Page>
      <Head>
        <title>Admin edit banner</title>
      </Head>
      <Body>
      <div className="h-100 flex-col">
        <NavigationBar/>
        <div className="flex-grow flex-col">
          <AdminContainer className="flex-grow">
            <If condition={this.context.getStore(BannerStore).get(id).isLoaded()}>
              <AdminBannerForm id={id} update={true}/>
            </If>
          </AdminContainer>
        </div>
        <Alerts />
      </div>
      </Body>
    </Page>;
  }
}, [BannerStore], () => ({}));




// WEBPACK FOOTER //
// ./src/main/app/pages/_admin-banner-edit/AdminBannerEditPage.js