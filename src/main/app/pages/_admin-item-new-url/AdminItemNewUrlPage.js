import React from 'react';
import {AdminContainer} from '../../components/_admin-container/AdminContainer';
import {Body, Head, Page} from '../../Page';
import {ItemUrlForm} from '../../components/_item-url-form/ItemUrlForm';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Alerts} from '../../components/_alerts/Alerts';

const {object, string} = React.PropTypes;

export class AdminItemNewUrlPage extends React.Component {
  static displayName = 'AdminItemNewFromUrlPage';

  static propTypes = {
    errors: object.isRequired,
    url: string.isRequired
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const {errors, url} = this.props;
    return <Page>
      <Head>
        <title>Admin new item from url</title>
      </Head>
      <Body>
      <div className="h-100 flex-col">
        <NavigationBar/>
        <div className="flex-grow flex-col">
          <AdminContainer className="flex-grow">
            <ItemUrlForm admin={true} errors={errors} url={url}/>
          </AdminContainer>
        </div>
        <Alerts />
      </div>
      </Body>
    </Page>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/pages/_admin-item-new-url/AdminItemNewUrlPage.js