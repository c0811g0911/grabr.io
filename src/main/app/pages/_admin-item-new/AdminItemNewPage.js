import React from 'react';
import uuid from 'node-uuid';
import {AdminContainer} from '../../components/_admin-container/AdminContainer';
import {Body, Head, Page} from '../../Page';
import {ItemForm} from '../../components/_item-form/ItemForm';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Alerts} from '../../components/_alerts/Alerts';
import {readAdminItemFromUrl} from '../../actions/AdminItemActionCreators';
import {ItemStore} from '../../stores/DataStores';
import {connectToStores} from 'fluxible-addons-react';

const {string, func} = React.PropTypes;

export const AdminItemNewPage = connectToStores(class extends React.Component {
  static displayName = 'AdminItemNewPage';

  static propTypes = {
    url: string
  };

  static contextTypes = {
    executeAction: func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {id: this.props.location.query.url || uuid.v4()};
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    const {url} = this.props.location.query;
    if (url) {
      this.context.executeAction(readAdminItemFromUrl, {url});
    }
  }

  render() {
    const {location: {query: {url}}, item} = this.props;
    const {id} = this.state;

    return (
      <Page>
        <Head>
          <title>Admin new item</title>
        </Head>
        <Body>
        <div className="h-100 flex-col">
          <NavigationBar/>
          <If condition={!url || item.isLoaded()}>
            <div className="flex-grow flex-col">
              <AdminContainer className="flex-grow">
                <ItemForm id={id} url={url} admin={true}/>
              </AdminContainer>
            </div>
          </If>
          <Alerts />
        </div>
        </Body>
      </Page>
    );
  }
}, [ItemStore], ({getStore}, {location: {query: {url}}}) => {
  return {
    item: getStore(ItemStore).get(url)
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/_admin-item-new/AdminItemNewPage.js