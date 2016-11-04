import React from 'react';
import {Actions} from '../../actions/Constants';
import {AdminContainer} from '../../components/_admin-container/AdminContainer';
import {Body, Head, Page} from '../../Page';
import {connectToStores} from 'fluxible-addons-react';
import {ItemForm} from '../../components/_item-form/ItemForm';
import {ItemStore} from '../../stores/DataStores';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {readAdminItem} from '../../actions/AdminItemActionCreators';
import {Alerts} from '../../components/_alerts/Alerts';

const {string, func, shape} = React.PropTypes;

export const AdminItemEditPage = connectToStores(class extends React.Component {
  static displayName = 'AdminItemEditPage';

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
    this.context.executeAction(readAdminItem, {id});
  }

  //componentWillUnmount() {
  //  const {id} = this.props.params;
  //  this.context.executeAction(context => {
  //    context.dispatch(Actions.UNLOAD_DATA_ITEM, {id, storeName: ItemStore.storeName});
  //  });
  //}

  render() {
    const {id} = this.props.params;
    return <Page>
      <Head>
        <title>Admin edit item</title>
      </Head>
      <Body>
      <div className="h-100 flex-col">
        <NavigationBar/>
        <div className="flex-grow flex-col">
          <AdminContainer className="flex-grow">
            <If condition={this.context.getStore(ItemStore).get(id).isLoaded()}>
              <ItemForm id={id} admin={true} update={true}/>
            </If>
          </AdminContainer>
        </div>
        <Alerts />
      </div>
      </Body>
    </Page>;
  }
}, [ItemStore], () => ({}));



// WEBPACK FOOTER //
// ./src/main/app/pages/_admin-item-edit/AdminItemEditPage.js