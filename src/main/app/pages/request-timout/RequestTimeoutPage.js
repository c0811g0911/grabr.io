import {FormattedMessage} from 'react-intl';
import React from 'react';
import {Body, Page} from '../../Page';

export class RequestTimeoutPage extends React.Component {

  render() {
    return (
      <Page>
        <Body>
        <div>
          <h1>
            <FormattedMessage id="RequestTimeoutPage.RequestTimedOut"/>
          </h1>
        </div>
        </Body>
      </Page>
    );
  }
}



// WEBPACK FOOTER //
// ./src/main/app/pages/request-timeout/RequestTimeoutPage.js