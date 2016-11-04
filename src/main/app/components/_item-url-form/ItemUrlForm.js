import React, {PropTypes} from 'react';
import {Link} from 'react-router/es6';
import {SyncButton} from '../_sync-button/SyncButton';
import {Validator} from '../../utils/Validator';
import {renderFields} from '../../renderers/renderFields';
import {FormattedMessage} from 'react-intl';
import {pushHistoryState} from '../../actions/HistoryActionCreators';


const schema = {
  url: ['required', 'url']
};

const formSchema = {
  url: {}
};

export class ItemUrlForm extends React.Component {
  static displayName = 'ItemUrlForm';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const errors = {};
    let url = '';
    if (props.errors) {
      errors.url = ['invalid'];
    }
    if (props.url) {
      url = decodeURIComponent(props.url);
    }

    this.state = {
      attributes: {url},
      errors
    };
    this.validator = new Validator(this, schema);
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.validator.validateForm()) {
      this.context.executeAction(pushHistoryState, [
        '/admin/items/new?url=' + encodeURIComponent(this.state.attributes.url)
      ]);
    }
  }

  render() {
    return <form className="grabr-form" onSubmit={this.handleSubmit.bind(this)}>
      <fieldset>
        {renderFields('item_url', formSchema, {
          component: this,
          validator: this.validator
        })}
      </fieldset>
      <section className="flex-row flex-justify-center controls">
        <SyncButton type="submit">
          <FormattedMessage id="shared.create"/>
        </SyncButton>
        <Link to="/admin/items" className="flex-self-center transparent link-unstyled" type="button">
          <FormattedMessage id="shared.cancel"/>
        </Link>
      </section>
    </form>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_item-url-form/ItemUrlForm.js