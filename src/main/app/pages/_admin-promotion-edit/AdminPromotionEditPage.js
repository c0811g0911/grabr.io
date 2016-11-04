import React from 'react';
import {AdminContainer} from '../../components/_admin-container/AdminContainer';
import {Body, Head, Page} from '../../Page';
import {connectToStores} from 'fluxible-addons-react';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {PromotionForm} from '../../components/_promotion-form/PromotionForm';
import {Alerts} from '../../components/_alerts/Alerts';
import {PromotionStore} from '../../stores/DataStores';
import {readAdminPromotion} from '../../actions/AdminPromotionActionCreators';

const {string, func, shape} = React.PropTypes;

export const AdminPromotionEditPage = connectToStores(class extends React.Component {
  static displayName = 'AdminPromotionEditPage';

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
    this.context.executeAction(readAdminPromotion, {id});
  }

  render() {
    const {id} = this.props.params;
    return <Page>
      <Head>
        <title>Admin edit promotion</title>
      </Head>
      <Body>
      <div className="h-100 flex-col">
        <NavigationBar/>
        <div className="flex-grow flex-col">
          <AdminContainer className="flex-grow">
            <If condition={this.context.getStore(PromotionStore).get(id).isLoaded()}>
              <PromotionForm id={id} update={true}/>
            </If>
          </AdminContainer>
        </div>
        <Alerts />
      </div>
      </Body>
    </Page>;
  }
}, [PromotionStore], () => {
  return {};
});



// WEBPACK FOOTER //
// ./src/main/app/pages/_admin-promotion-edit/AdminPromotionEditPage.js