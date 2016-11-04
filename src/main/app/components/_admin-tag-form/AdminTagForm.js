import {ImageUpload} from '../_image-upload/ImageUpload';
import {Link} from 'react-router/es6';
import React from 'react';
import {renderFields} from '../../renderers/renderFields';
import {SyncButton} from '../_sync-button/SyncButton';
import {Validator} from '../../utils/Validator';
import {connectToStores} from 'fluxible-addons-react';
import {createAdminTag, deleteAdminTag, updateAdminTag} from '../../actions/AdminTagActionCreators';
import {FormattedMessage} from 'react-intl';
import {ImageStore, TagStore} from '../../stores/DataStores';
import {pushHistoryState} from '../../actions/HistoryActionCreators';

export async function createAndNavigateToAdminTagListPage(context, payload) {
  const {executeAction} = context;
  const {id, en, ru, image_file_id} = payload;
  await executeAction(createAdminTag, {id, en, ru, image_file_id});
  return executeAction(pushHistoryState, ['/admin/tags']);
}

export async function updateAndNavigateToAdminTagListPage(context, payload) {
  const {executeAction} = context;
  const {id, en, ru, image_file_id} = payload;
  await executeAction(updateAdminTag, {id, en, ru, image_file_id});
  return executeAction(pushHistoryState, ['/admin/tags']);
}

export async function deleteAndNavigateToAdminTagListPage(context, payload) {
  const {executeAction} = context;
  const {id} = payload;
  await executeAction(deleteAdminTag, {id});
  return executeAction(pushHistoryState, ['/admin/tags']);
}

const {func} = React.PropTypes;

export const AdminTagForm = connectToStores(class extends React.Component {
  static contextTypes = {
    executeAction: func.isRequired
  };

  constructor(props) {
    super(props);

    const {tag} = props;
    const title = tag.get('title') || {en: '', ru: ''};

    this.state = {
      attributes: {
        en: title.en,
        ru: title.ru,
        image: tag.get('image')
      },
      errors: {}
    };

    this.validator = new Validator(this, {
      image: ['required'],
      en: ['required'],
      ru: ['required']
    });

    this.formSchema = function (tagId) {
      return {
        image: {
          label: 'Image',
          input: ImageUpload,
          wrapInDiv: true,
          inputProps: {
            parentType: 'tags',
            parentId: tagId,
            property: 'image'
          }
        },
        en: {label: 'EN'},
        ru: {label: 'RU'}
      };
    };
  }

  componentWillReceiveProps({tag}) {
    this.setState({
      attributes: {
        ...this.state.attributes,
        image: tag.get('image') || null
      },
      errors: tag.getErrors() || {}
    });
  }

  render() {
    return <form className="grabr-form" name="admin_tags" onSubmit={event => {
      event.preventDefault();

      const {id} = this.props;
      const {attributes} = this.state;
      const {image} = attributes;

      if (this.validator.validateForm()) {
        if (this.props.update) {
          this.context.executeAction(updateAndNavigateToAdminTagListPage, {
            id, ...attributes,
            image_file_id: image.get('file_id') || image.get('id')
          });
        } else {
          this.context.executeAction(createAndNavigateToAdminTagListPage, {
            id, ...attributes,
            image_file_id: image.get('file_id') || image.get('id')
          });
        }
      }
    }}>

      <fieldset>
        <SyncButton className="sync-delete" isSyncing={this.props.tag.isSyncing} onClick={() => {
          this.context.executeAction(deleteAndNavigateToAdminTagListPage, {id: this.props.id});
        }}><FormattedMessage id="shared.delete"/></SyncButton>
        {renderFields('admin_tag', this.formSchema(this.props.id), {
          component: this,
          validator: this.validator,
          messages: {
            image: {
              required: 'Image must be specified'
            },
            en: {
              required: "Title EN can't be blank"
            },
            ru: {
              required: "Title RU can't be blank"
            }
          }
        })}</fieldset>
      <section className="controls">
        <SyncButton type="submit" isSyncing={this.props.tag.isSyncing}><FormattedMessage id={this.props.update
          ? 'save'
          : 'create'}/></SyncButton>
        <Link to="/admin/tags"
                 className="transparent link-unstyled"
                 type="button"><FormattedMessage id="shared.cancel"/></Link>
      </section>
    </form>;
  }
}, [TagStore, ImageStore], ({getStore}, {id}) => {
  return {
    tag: getStore(TagStore).get(id)
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_admin-tag-form/AdminTagForm.js