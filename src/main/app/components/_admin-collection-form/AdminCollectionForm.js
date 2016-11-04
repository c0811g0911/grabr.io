import {ImageUpload} from '../_image-upload/ImageUpload';
import {Link} from 'react-router/es6';
import React from 'react';
import {renderFields} from '../../renderers/renderFields';
import {SyncButton} from '../_sync-button/SyncButton';
import {Validator} from '../../utils/Validator';
import {
  createAdminCollection,
  deleteAdminCollection,
  updateAdminCollection
} from '../../actions/AdminCollectionActionCreators';
import {CollectionShape, shapeCollection} from '../../models/CollectionModel';
import {CollectionStore, ImageStore} from '../../stores/DataStores';
import {connectToStores} from 'fluxible-addons-react';
import {FormattedMessage} from 'react-intl';
import {CountrySelect} from '../country-select/CountrySelect';
import {TextareaInput} from '../_field/Field';
import {pushHistoryState} from '../../actions/HistoryActionCreators';

async function createAndNavigateToAdminCollectionListPage(context, payload) {
  const {executeAction} = context;
  const {description, id, images, title, lead, targetLocation} = payload;
  await executeAction(createAdminCollection, {description, id, images, title, lead, targetLocation});
  return executeAction(pushHistoryState, ['/admin/collections']);
}

async function updateAndNavigateToAdminCollectionListPage(context, payload) {
  const {executeAction} = context;
  const {description, id, images, title, lead, targetLocation} = payload;
  await executeAction(updateAdminCollection, {description, id, images, title, lead, targetLocation});
  return executeAction(pushHistoryState, ['/admin/collections']);
}

async function deleteAndNavigateToAdminCollectionListPage(context, payload) {
  const {executeAction} = context;
  const {id} = payload;
  await executeAction(deleteAdminCollection, {id});
  return executeAction(pushHistoryState, ['/admin/collections']);
}

const {bool, func, number, string, oneOfType} = React.PropTypes;

export const AdminCollectionForm = connectToStores(class extends React.Component {
  static displayName = 'AdminCollectionForm';

  static contextTypes = {
    executeAction: func.isRequired
  };

  static propTypes = {
    collection: CollectionShape.isRequired,
    id: oneOfType([number, string]).isRequired,
    isSyncing: bool.isRequired,
    update: bool
  };

  constructor(props) {
    super(props);
    const {collection} = this.props;
    const {description = {}, images, lead = {}, title = {}, targetLocation = {}} = collection;

    this.state = {
      attributes: {
        descriptionEn: description.en,
        descriptionRu: description.ru,
        images: images,
        leadEn: lead.en,
        leadRu: lead.ru,
        titleEn: title.en,
        titleRu: title.ru,
        targetLocation
      },
      errors: {}
    };

    this.validator = new Validator(this, {
      descriptionEn: ['required'],
      descriptionRu: ['required'],
      images: ['required_array'],
      leadEn: [],
      leadRu: [],
      titleEn: ['required'],
      titleRu: ['required']
    });

    this.formSchema = function (collectionId) {
      return {
        images: {
          label: 'Images',
          input: ImageUpload,
          wrapInDiv: true,
          inputProps: {
            isMultiple: true,
            parentId: collectionId,
            parentType: 'collections'
          }
        },
        titleEn: {
          label: 'Title [en]'
        },
        titleRu: {
          label: 'Title [ru]'
        },
        descriptionEn: {
          label: 'Description [en]',
          input: TextareaInput
        },
        descriptionRu: {
          label: 'Description [ru]',
          input: TextareaInput
        },
        leadEn: {
          label: 'Lead [en]'
        },
        leadRu: {
          label: 'Lead [ru]'
        },
        targetLocation: {
          label: 'Target country',
          input: CountrySelect
        }
      };
    };
  }

  componentWillReceiveProps({collection, errors}) {
    const attributes = {
      ...this.state.attributes,
      images: collection.images
    };
    this.setState({attributes, errors});
  }

  render() {
    const {executeAction} = this.context;
    const {id, isSyncing, update} = this.props;
    const {attributes} = this.state;

    return <form className="grabr-form" name="admin_collections" onSubmit={event => {
      event.preventDefault();
      if (this.validator.validateForm()) {
        {
          if (attributes.leadEn || attributes.leadRu) {
            attributes.lead = {
              en: attributes.leadEn || ' ',
              ru: attributes.leadRu || ' '
            };
          } else {
            attributes.lead = {en: '', ru: ''};
          }
        }
        const payload = {
          description: {
            en: attributes.descriptionEn,
            ru: attributes.descriptionRu
          },
          id,
          images: attributes.images,
          lead: attributes.lead,
          title: {
            en: attributes.titleEn,
            ru: attributes.titleRu
          },
          targetLocation: attributes.targetLocation
        };
        if (update) {
          executeAction(updateAndNavigateToAdminCollectionListPage, payload);
        } else {
          executeAction(createAndNavigateToAdminCollectionListPage, payload);
        }
      }
    }}>

      <fieldset>
        <SyncButton className="sync-delete" isSyncing={isSyncing} onClick={() => {
          executeAction(deleteAndNavigateToAdminCollectionListPage, {id});
        }}>
          <FormattedMessage id="shared.delete"/>
        </SyncButton>
        {renderFields('admin_collection', this.formSchema(id), {
          component: this,
          validator: this.validator,
          messages: {
            descriptionEn: {
              required: "Description [en] can't be blank."
            },
            descriptionRu: {
              required: "Description [ru] can't be blank."
            },
            images: {
              required_array: 'Images must be specified.'
            },
            leadEn: {
              required: "Lead [en] can't be blank."
            },
            leadRu: {
              required: "Lead [ru] can't be blank."
            },
            titleEn: {
              required: "Title [en] can't be blank."
            },
            titleRu: {
              required: "Title [ru] can't be blank."
            }
          }
        })}
      </fieldset>
      <section className="controls">
        <SyncButton type="submit" isSyncing={isSyncing}>
          <FormattedMessage id={update ? 'save' : 'create'}/>
        </SyncButton>
        <Link to="/admin/collections" className="transparent link-unstyled">
          <FormattedMessage id="shared.cancel"/>
        </Link>
      </section>
    </form>;
  }
}, [CollectionStore, ImageStore], ({getStore}, {id}) => {
  const collection = getStore(CollectionStore).get(id);
  return {
    collection: shapeCollection(collection),
    errors: collection.getErrors(),
    isSyncing: collection.isSyncing
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_admin-collection-form/AdminCollectionForm.js