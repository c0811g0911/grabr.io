import React, {PropTypes} from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Link} from 'react-router/es6';
import {SyncButton} from '../_sync-button/SyncButton';
import {Validator} from '../../utils/Validator';
import {updateSSN} from '../../actions/ProfileActionCreators';
import {FormattedMessage} from 'react-intl';
import {AccountStore} from '../../stores/AccountStore';

const schema = {
  ssn_last_4: ['required', {'min_length': 4}]
};

class SSNView extends React.Component {
  static displayName = 'SSNView';

  handleEditClick() {
    this.props.onEditClick();
  }

  renderText() {
    return <FormattedMessage id={`forms.verification.copy.${this.props.user.get('verification').ssn_last_4_provided ? 'success' : 'provided'}`}/>;
  }

  render() {
    return <div className="grabr-form">
      <p>{this.renderText()}</p>
      <section className="flex-row flex-justify-center controls">
        <button className="grabr-button" onClick={this.handleEditClick.bind(this)}>
          <FormattedMessage id="forms.verification.update_ssn"/>
        </button>
        <Link to="/settings" className="flex-self-center transparent link-unstyled">
          <FormattedMessage id="shared.cancel"/>
        </Link>
      </section>
    </div>;
  }
}

class SSNForm extends React.Component {
  static displayName = 'SSNForm';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      attributes: {ssn_last_4: ''},
      errors: {}
    };
    this.validator = new Validator(this, schema);
  }

  changeAttribute(name, {value}) {
    this.setState(Object.assign(this.state.attributes, {[name]: value}));
  }

  handleInputChange(name, event) {
    this.changeAttribute(name, {value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.validator.validateForm()) {
      this.context.executeAction(updateSSN, {
        ssn_last_4: this.state.attributes.ssn_last_4
      });
    }
  }

  render() {
    return <div>
      <form className="grabr-form" onSubmit={this.handleSubmit.bind(this)}>
        <fieldset>
          <label className="grabr-input">
            <FormattedMessage id="forms.verification.fields.ssn_last_4.label"/>
            <div className="ssn-wrapper">
              <span>XXX-XX-</span>
              <input value={this.state.attributes.ssn_last_4}
                     onChange={this.handleInputChange.bind(this, 'ssn_last_4')}/>
            </div>
          </label>
        </fieldset>
        <section className="flex-row flex-justify-center controls">
          <SyncButton isSyncing={this.props.isSyncing} type="submit">
            <FormattedMessage id="shared.save"/>
          </SyncButton>
          <button className="transparent" type="button" onClick={this.props.onCancel}>
            <FormattedMessage id="shared.cancel"/>
          </button>
        </section>
      </form>
    </div>;
  }
}

export const Verification = connectToStores(class extends React.Component {
  static displayName = 'Verification';

  static contextTypes = {
    getStore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {mode: null};
  }

  componentDidMount() {
    let mode = null;
    if (this.context.getStore(AccountStore).needsSSN()) {
      mode = 'edit';
    } else {
      mode = 'view';
    }
    this.setState({mode});
  }

  switchToEdit() {
    this.setState({mode: 'edit'});
  }

  switchToView() {
    this.setState({mode: 'view'});
  }

  render() {
    switch (this.state.mode) {
      case 'view':
        return <SSNView user={this.props.user}
                        isSyncing={this.props.isSyncing}
                        verification={this.props.verification}
                        onEditClick={this.switchToEdit.bind(this)}/>;
      case 'edit':
        return <SSNForm user={this.props.user}
                        isSyncing={this.props.isSyncing}
                        verification={this.props.verification}
                        onCancel={this.switchToView.bind(this)}/>;
      default:
        return null;
    }
  }
}, [AccountStore], ({getStore}) => {
  return {
    verification: getStore(AccountStore).getUser().getVerification(),
    user: getStore(AccountStore).getUser(),
    isSyncing: getStore(AccountStore).isSyncing()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_verification/Verification.js