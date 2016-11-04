import React, {PropTypes} from 'react';
import {Validator} from '../../utils/Validator';
import {Link} from 'react-router/es6';
import {SyncButton} from '../_sync-button/SyncButton';
import {connectToStores} from 'fluxible-addons-react';
import {updateProfile} from '../../actions/ProfileActionCreators';
import {createPersonalRenderer} from '../../renderers/personal';
import _, {merge} from 'lodash';
import {AccountStore} from '../../stores/AccountStore';
import {ImageStore} from '../../stores/DataStores';
import {FormattedMessage} from 'react-intl';

export const PersonalForm = connectToStores(class extends React.Component {
  static displayName = 'PersonalForm';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      attributes: {
        first_name: props.user.get('first_name'),
        last_name: props.user.get('last_name'),
        avatar: props.user.get('avatar') || null
      },
      errors: {}
    };
    this.validator = new Validator(this);
  }

  componentDidMount() {
    this.renderPersonal = createPersonalRenderer({
      component: this,
      validator: this.validator,
      userId: this.context.getStore(AccountStore).getUser().get('id')
    });
    this.setState({loaded: true});
  }

  componentWillReceiveProps(props) {
    this.setState({
      attributes: Object.assign(this.state.attributes, {
        avatar: props.user.get('avatar') || null
      }),
      errors: props.errors || {}
    });
  }

  // Handlers
  //
  handleSubmit(event) {
    event.preventDefault();

    if (this.validator.validateForm()) {
      this.context.executeAction(updateProfile, {
        attributes: this.state.attributes
      });
    }
  }

  // Renderers
  //
  render() {
    return (
      <div>
        <form className="grabr-form" onSubmit={this.handleSubmit.bind(this)}>
          <fieldset>
            {this.state.loaded && this.renderPersonal()}
          </fieldset>
          <section className="flex-row flex-justify-center controls">
            <SyncButton isSyncing={this.props.isSyncing} type="submit">
              <FormattedMessage id="shared.update"/>
            </SyncButton>
            <Link to="/settings" className="flex-self-center transparent link-unstyled">
              <FormattedMessage id="shared.cancel"/>
            </Link>
          </section>
        </form>
      </div>
    );
  }

}, [AccountStore, ImageStore], ({getStore}) => {
  const account = getStore(AccountStore);
  return {
    user: account.getUser(),
    isSyncing: account.isSyncing(),
    errors: account.getErrors()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_personal-form/PersonalForm.js