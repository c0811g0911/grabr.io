import React from 'react';
import uuid from 'node-uuid';
import {AdminContainer} from '../../components/_admin-container/AdminContainer';
import {Body, Head, Page} from '../../Page';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {PromotionForm} from '../../components/_promotion-form/PromotionForm';
import {Alerts} from '../../components/_alerts/Alerts';

export class AdminPromotionNewPage extends React.Component {
  static displayName = 'AdminPromotionNewPage';

  constructor(props) {
    super(props);
    this.state = {id: uuid.v4()};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const {id} = this.state;
    return <Page>
      <Head>
        <title>Admin new promotion</title>
      </Head>
      <Body>
      <div className="h-100 flex-col">
        <NavigationBar/>
        <div className="flex-grow flex-col">
          <AdminContainer className="flex-grow">
            <PromotionForm id={id}/>
          </AdminContainer>
        </div>
        <Alerts />
      </div>
      </Body>
    </Page>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/pages/_admin-promotion-new/AdminPromotionNewPage.js