import React from 'react';
import {LoginEmail} from '../_login-email/LoginEmail';
import {SignupEmail} from '../_signup-email/SignupEmail';
import {LoginFacebook} from '../_login-facebook/LoginFacebook';
import {googleAnalyticsTrackLoginOpen} from '../../../3rd-party/google/GoogleAnalyticsEvents';
import {FormattedMessage} from 'react-intl';
import './_login.scss';

const {string} = React.PropTypes;

export class Login extends React.Component {
  static displayName = 'Login';

  static propTypes = {
    copy: string
  };

  static defaultProps = {
    mode: 'SIGNUP'
  };

  constructor(props) {
    super(props);

    this.state = {
      mode: props.mode,
      showFacebook: true
    };
  }

  componentDidMount() {
    if (this.state.mode === 'LOGIN') {
      googleAnalyticsTrackLoginOpen();
    }
  }

  handleSwitch = () => {
    this.setState({
      mode: this.state.mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN'
    });
  }

  toggleFacebook = () => {
    this.setState({
      showFacebook: !this.state.showFacebook
    });
  };

  render() {
    const {mode} = this.state;
    const {copy} = this.props;

    return (
      <section className="login">
        <If condition={copy}>
          <FormattedMessage id={`components.login.copy.${copy}`}/>
        </If>
        <h1>
          <Choose>
            <When condition={copy}>
              <FormattedMessage id={`components.login.labels.${mode.toLowerCase()}_cause`}/>
            </When>
            <Otherwise>
              <FormattedMessage id={`components.login.labels.${mode.toLowerCase()}`}/>
            </Otherwise>
          </Choose>
        </h1>
        <If condition={this.state.showFacebook}>
          <LoginFacebook />
        </If>
        <Choose>
          <When condition={mode === 'LOGIN'}>
            <LoginEmail onModeChange={this.toggleFacebook}/>
          </When>
          <Otherwise>
            <SignupEmail onModeChange={this.toggleFacebook}/>
          </Otherwise>
        </Choose>
        <button onClick={this.handleSwitch} className="link">
          <FormattedMessage id={`components.login.labels.switch_${mode.toLowerCase()}`}/>
        </button>
      </section>
    );
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_login/Login.js