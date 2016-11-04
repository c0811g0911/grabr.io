import React from 'react';
import uuid from 'node-uuid';
import {AdminBannerForm} from '../../components/_admin-banner-form/AdminBannerForm';
import {AdminContainer} from '../../components/_admin-container/AdminContainer';
import {Body, Head, Page} from '../../Page';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Alerts} from '../../components/_alerts/Alerts';

export class AdminBannerNewPage extends React.Component {
  static displayName = 'AdminBannerNewPage';

  constructor(props) {
    super(props);
    this.state = {id: uuid.v4()};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return <Page>
      <Head>
        <title>Admin new banner</title>
      </Head>
      <Body>
      <div className="h-100 flex-col">
        <NavigationBar/>
        <div className="flex-grow flex-col">
          <AdminContainer className="flex-grow">
            <AdminBannerForm id={this.state.id}/>
          </AdminContainer>
        </div>
        <Alerts />
      </div>
      </Body>
    </Page>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/pages/_admin-banner-new/AdminBannerNewPage.js