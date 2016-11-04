import React from 'react';
import {Actions} from '../../actions/Constants';
import {AdminCollectionForm} from '../../components/_admin-collection-form/AdminCollectionForm';
import {AdminContainer} from '../../components/_admin-container/AdminContainer';
import {Body, Head, Page} from '../../Page';
import {CollectionStore} from '../../stores/DataStores';
import {connectToStores} from 'fluxible-addons-react';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {readAdminCollection} from '../../actions/AdminCollectionActionCreators';
import {Alerts} from '../../components/_alerts/Alerts';

const {string, func, shape} = React.PropTypes;

export const AdminCollectionEditPage = connectToStores(class extends React.Component {
  static displayName = 'AdminCollectionEditPage';

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
    this.context.executeAction(readAdminCollection, {id});
  }

  //componentWillUnmount() {
  //  const {id} = this.props.params;
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_DATA_ITEM, {id, storeName: CollectionStore.storeName});
  //  });
  //}

  render() {
    const {id} = this.props.params;
    return <Page>
      <Head>
        <title>Admin edit collection</title>
      </Head>
      <Body>
      <div className="h-100 flex-col">
        <NavigationBar/>
        <div className="flex-grow flex-col">
          <AdminContainer className="flex-grow">
            <If condition={this.context.getStore(CollectionStore).get(id).isLoaded()}>
              <AdminCollectionForm id={id} update={true}/>
            </If>
          </AdminContainer>
        </div>
        <Alerts />
      </div>
      </Body>
    </Page>;
  }
}, [CollectionStore], () => ({}));



// WEBPACK FOOTER //
// ./src/main/app/pages/_admin-collection-edit/AdminCollectionEditPage.js