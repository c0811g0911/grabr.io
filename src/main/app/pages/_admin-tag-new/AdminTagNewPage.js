import React from 'react';
import uuid from 'node-uuid';
import {AdminContainer} from '../../components/_admin-container/AdminContainer';
import {AdminTagForm} from '../../components/_admin-tag-form/AdminTagForm';
import {Body, Head, Page} from '../../Page';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {Alerts} from '../../components/_alerts/Alerts';

export class AdminTagNewPage extends React.Component {
  static displayName = 'AdminTagNewPage';

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
        <title>Admin new tag</title>
      </Head>
      <Body>
      <div className="h-100 flex-col">
        <NavigationBar/>
        <div className="flex-grow flex-col">
          <AdminContainer className="flex-grow">
            <AdminTagForm id={this.state.id}/>
          </AdminContainer>
        </div>
        <Alerts />
      </div>
      </Body>
    </Page>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/pages/_admin-tag-new/AdminTagNewPage.js