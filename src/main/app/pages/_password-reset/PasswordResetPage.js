import React from 'react';
import {SyncButton} from '../../components/_sync-button/SyncButton';
import {changePassword} from '../../actions/LoginActionCreators';
import {connectToStores} from 'fluxible-addons-react';
import {AccountStore} from '../../stores/AccountStore';
import {renderFields} from '../../renderers/renderFields';
import {Validator} from '../../utils/Validator';
import {NavigationBar} from '../../components/navigation-bar/NavigationBar';
import {FormattedMessage} from 'react-intl';
import {Page, Head, Body} from '../../Page';
import {AppStore} from '../../stores/AppStore';
import {Alerts} from '../../components/_alerts/Alerts';
import {trackPageView} from '../../utils/trackPageView';

const {func, shape, bool, object} = React.PropTypes;

export const PasswordResetPage = connectToStores(class extends React.Component {
  static displayName = 'PasswordResetPage';

  static propTypes = {
    location: shape({
      query: object.isRequired
    }),
    isSyncing: bool
  };

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired,
    intl: object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      attributes: {
        password: '',
        confirm_password: ''
      },
      errors: {}
    };
    // fixme: declare all password validations.
    this.validator = new Validator(this, {
      password: ['required', 'confirm', {min_length: 8}],
      confirm_password: []
    });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    trackPageView(this.context, {path: `/password/reset`});
  }

  componentWillReceiveProps(props) {
    this.setState({errors: props.errors});
  }

  render() {
    const {attributes: {password}} = this.state;
    const {location: {query: {token}}, isSyncing} = this.props;

    return (
      <Page>
        <Head>
          <title>{this.context.intl.formatMessage({id: 'pages.password_reset.document_title'})}</title>
        </Head>
        <Body>
          <div className="min-h-100 flex-col">
            <NavigationBar/>
            <div className="bg-primary flex-grow flex-row flex-items-center">
              <div className="container w-100">
                <div className="row">
                  <div className="col-xs-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3
                                  panel panel--xs-top-rounded panel--xs-bottom-rounded text-black"
                  >
                    <form className="grabr-form" onSubmit={event => {
                      event.preventDefault();
                      if (this.validator.validateForm()) {
                        this.context.executeAction(changePassword, {token, password});
                      }
                    }}>
                      <fieldset>
                        {renderFields('password_reset', {
                          password: {},
                          confirm_password: {}
                        }, {
                          component: this,
                          validator: this.validator
                        })}
                      </fieldset>
                      <section className="controls">
                        <SyncButton isSyncing={isSyncing} type="submit">
                          <FormattedMessage id="shared.submit" />
                        </SyncButton>
                      </section>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <Alerts />
          </div>
        </Body>
      </Page>
    );
  }
}, [AccountStore], context => ({
  isSyncing: context.getStore(AccountStore).isSyncing(),
  errors: context.getStore(AccountStore).getErrors()
}));



// WEBPACK FOOTER //
// ./src/main/app/pages/_password-reset/PasswordResetPage.js