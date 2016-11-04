import React from 'react';
import {Actions} from '../../actions/Constants';
import {AdminContainer} from '../../components/_admin-container/AdminContainer';
import {AdminTagListStore} from '../../stores/AdminSequenceStores';
import {Body, Head, Page} from '../../Page';
import {connectToStores} from 'fluxible-addons-react';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Paginator} from '../../utils/Paginator';
import {readAdminTagList} from '../../actions/AdminTagActionCreators';
import {TagStore} from '../../stores/DataStores';
import {Alerts} from '../../components/_alerts/Alerts';

const {string, func, shape} = React.PropTypes;

export const AdminTagEditPage = connectToStores(class extends React.Component {
  static displayName = 'AdminTagEditPage';

  static propTypes = {
    params: shape({id: string.isRequired}).isRequired
  };

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.paginatorActive = new Paginator(this.context, {
      pageSize: 666,
      storeName: AdminTagListStore.storeName,
      action: readAdminTagList
    });
    this.paginatorActive.reload();
  }

  //componentWillUnmount() {
  //  const {id} = this.props.params;
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_DATA_ITEM, {id, storeName: AdminTagListStore.storeName});
  //  });
  //}

  render() {
    const {id} = this.props.params;
    return <Page>
      <Head>
        <title>Admin edit tag</title>
      </Head>
      <Body>
      <div className="h-100 flex-col">
        <NavigationBar/>
        <div className="flex-grow flex-col">
          <AdminContainer className="flex-grow">
            <If condition={this.context.getStore(TagStore).get(id).isLoaded()}>
              <AdminTagForm id={id} update={true}/>
            </If>
          </AdminContainer>
        </div>
        <Alerts />
      </div>
      </Body>
    </Page>;
  }
}, [TagStore], () => ({}));



// WEBPACK FOOTER //
// ./src/main/app/pages/_admin-tag-edit/AdminTagEditPage.js