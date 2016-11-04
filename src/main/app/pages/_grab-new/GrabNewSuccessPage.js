import React from 'react';
import {Page, Head, Body} from '../../Page';
import {Spinner} from '../../components/_spinner/Spinner';
import {Link} from 'react-router/es6';
import {mixpanelClickOrderCreationInviteFriendsOrderCreation} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {FormattedMessage} from 'react-intl';
import deliveryIconUrl from '../../components/_grab-create/images/delivery.svg';
import {trackPageView} from '../../utils/trackPageView';

const {func} = React.PropTypes;

export class GrabNewSuccessPage extends React.Component {
  static displayName = 'GrabNewSuccessPage';

  static contextTypes = {
    getStore: func.isRequired
  };

  state = {
    isLoading: true
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/grabs/new/success`});
    setTimeout(() => {
      this.setState({isLoading: false});
    }, 2000);
  }

  renderProgress() {
    return (
      <div className="grabr-fullscreen grab-create-progress">
        <h1><FormattedMessage id="forms.grab.progress.title" /></h1>
        <Spinner />
        <h2><FormattedMessage id="forms.grab.progress.subtitle" /></h2>
      </div>
    );
  }

  renderFinal() {
    return (
      <div className="grabr-fullscreen grab-create-final">
        <img className="grab-create-final__img" src={ deliveryIconUrl }/>
        <h1><FormattedMessage id="forms.grab.final.title" /></h1>
        <h2><FormattedMessage id="forms.grab.final.subtitle" /></h2>

        <div className="inline-share m-b-2">
          <div className="inline-share__icon p-xs-l-1">
            <i className="icon icon--gift-box"/>
          </div>
          <div className="inline-share__caption p-xs-a-1">
            <div className="font-weight-bold">
              <FormattedMessage id="pages.share.invite_on_other_pages_1" />
            </div>
            <a href="/share"
               target="_blank"
               className="text-primary"
               onClick={() => {
                 mixpanelClickOrderCreationInviteFriendsOrderCreation();
               }}>
              <FormattedMessage id="pages.share.invite_on_other_pages_2" />
            </a>
          </div>
        </div>

        <Link
          to="/travel"
          className="btn btn-primary btn--create-grab-ok m-x-auto">
          <FormattedMessage id="shared.ok" />
        </Link>
      </div>
    );
  }

  render() {
    const {isLoading} = this.state;

    return (
      <Page>
        <Head>
        </Head>
        <Body>
          <div>
            <Choose>
              <When condition={isLoading}>
                {this.renderProgress()}
              </When>
              <Otherwise>
                {this.renderFinal()}
              </Otherwise>
            </Choose>
          </div>
        </Body>
      </Page>
    );
  }
}



// WEBPACK FOOTER //
// ./src/main/app/pages/_grab-new/GrabNewSuccessPage.js