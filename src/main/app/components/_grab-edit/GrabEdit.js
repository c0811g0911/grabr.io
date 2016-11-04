import React, {PropTypes} from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {SyncButton} from '../_sync-button/SyncButton';
import {Link} from 'react-router/es6';
import {renderDescription} from '../../renderers/grab_description';
import {renderDelivery} from '../../renderers/grab_delivery';
import {renderSummary} from '../../renderers/grab_summary';
import {FormattedMessage} from 'react-intl';
import {FormStore} from '../../stores/FormStore';
import {GrabStore, ItemStore} from '../../stores/DataStores';
import {updateGrab} from '../../actions/GrabActionCreators';
import {submitForm} from '../../actions/FormActionCreators';
import {AppStore} from '../../stores/AppStore';

export const GrabEdit = connectToStores(class extends React.Component {
  static displayName = 'GrabEdit';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired
  };

  handleSubmit(e) {
    e.preventDefault();

    this.context.executeAction(submitForm, {
      attributes: this.props.attributes,
      action: updateGrab
    });
  }

  render() {
    return <form className="grabr-form grab-edit" onSubmit={this.handleSubmit.bind(this)}>
      {renderDescription(this.props.attributes, this.props.errors, {
        properties: this.props.item ? this.props.item.get('properties') : [],
        locale: this.context.getStore(AppStore).getState().language
      })}
      {renderDelivery(this.props.attributes, this.props.errors)}
      {renderSummary(this.props.attributes, this.props.errors)}
      <section className="flex-row flex-justify-center controls">
        <SyncButton isSyncing={this.props.isSyncing} type="submit">
          <FormattedMessage id="shared.save"/>
        </SyncButton>
        <Link to={`/grabs/${this.props.id}`} className="flex-self-center transparent link-unstyled">
          <FormattedMessage id="shared.cancel"/>
        </Link>
      </section>
    </form>;
  }

}, [FormStore, GrabStore, ItemStore], (context) => {
  const formStore = context.getStore(FormStore);
  const attributes = formStore.getAttributes();

  return {
    item: attributes.itemId ? context.getStore(ItemStore).get(attributes.itemId) : null,
    attributes,
    errors: formStore.getErrors(),
    isSyncing: formStore.isSyncing()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_grab-edit/GrabEdit.js