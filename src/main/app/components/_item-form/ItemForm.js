import {ImageUpload} from '../_image-upload/ImageUpload';
import {Money} from '../_money/Money';
import {Link} from 'react-router/es6';
import React from 'react';
import {renderFields} from '../../renderers/renderFields';
import {SyncButton} from '../_sync-button/SyncButton';
import uuid from 'node-uuid';
import {Validator} from '../../utils/Validator';
import {AdminCollectionSuggestionListStore, AdminTagSuggestionListStore} from '../../stores/AdminSequenceStores';
import {AutocompleteTagListEditor} from '../autocomplete-tag-list-editor/AutocompleteTagListEditor';
import {CheckboxInput} from '../_field/Field.js';
import {connectToStores} from 'fluxible-addons-react';
import {createItem} from '../../actions/ItemActionCreators';
import {FormattedMessage} from 'react-intl';
import {ItemPropertyListEditor} from '../item-property-list-editor/ItemPropertyListEditor';
import {GrabFormFrom} from '../_cities-suggest/CitiesSuggest';
import {ImageStore, ItemStore} from '../../stores/DataStores';
import {readAdminCollectionSuggestionList, readAdminTagSuggestionList} from '../../actions/AdminActionCreators';
import {uploadImage} from '../../actions/ImageActionCreators';
import {shapeLocale} from '../../models/LocaleModel';
import {TextareaInput} from '../_field/Field';

const collectionShape = collection => {
  const {id, title = {}} = collection._attributes;
  return {
    id, title: `${ title.en } (${ title.ru })`
  };
};

const {arrayOf, bool, func, number, object, oneOfType, string, shape} = React.PropTypes;

const schema = {
  title: ['required', {'max_length': 70}],
  description: ['required', {'max_length': 1000}],
  estimate_price_cents: ['required', {'min_number': 500}, {'max_number': 500000}],
  shop_url: ['url'],
  images: ['required_array']
};

const formSchema = itemId => {
  return {
    images: {
      input: ImageUpload,
      inputProps: {
        isMultiple: true,
        parentId: itemId,
        parentType: 'items',
        maxNumber: 10
      }
    },
    title: {},
    description: {
      input: TextareaInput
    },
    shop_url: {},
    leadEn: {
      label: 'Lead [en]'
    },
    leadRu: {
      label: 'Lead [ru]'
    },
    estimate_price_cents: {
      input: Money,
      inputProps: {
        asInput: true
      }
    },
    collections: {
      input: AutocompleteTagListEditor,
      inputProps: {}
    },
    tags: {
      input: AutocompleteTagListEditor,
      inputProps: {}
    },
    from: {
      input: GrabFormFrom,
      inputProps: {
        value: {
          func: ({from}) => from && from.value,
          isFunc: true
        },
        query: {
          func: ({from}) => from && from.query,
          isFunc: true
        }
      }
    },
    featured: {
      input: CheckboxInput
    },
    published: {
      input: CheckboxInput
    },
    properties: {
      label: 'Properties',
      input: ItemPropertyListEditor
    }
  };
};

export const ItemForm = connectToStores(class extends React.Component {
  static displayName = 'ItemForm';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired
  };

  static propTypes = {
    admin: bool.isRequired,
    adminCollectionSuggestionList: arrayOf(shape({id: number, title: string})),
    adminTagSuggestionList: arrayOf(shape({id: number, title: string})),
    id: oneOfType([number, string]),
    item: object,
    title: string,
    update: bool.isRequired
  };

  constructor(props) {
    super(props);

    const {item, title} = props;
    const attributes = {
      title: title || item.get('title'),
      description: item.get('description'),
      estimate_price_cents: item.get('estimate_price_cents'),
      images: item.get('images') || [],
      leadEn: (shapeLocale(item.get('lead')) || {}).en || '',
      leadRu: (shapeLocale(item.get('lead')) || {}).ru || '',
      shop_url: item.get('shop_url'),
      featured: item.get('featured'),
      from: item.get('from') ? {value: item.get('from').get('id'), query: item.get('from').getFullTitle()} : null,
      published: item.get('published'),
      collections: (item.get('collections') || []).map(collectionShape),
      tags: (item.get('tags') || []).map(collectionShape),
      properties: item.get('properties') || []
    };

    this.state = {attributes, errors: {}};
    this.validator = new Validator(this, schema);
    this.formSchema = formSchema(props.id);
  }

  componentWillReceiveProps(props) {
    const attributes = {
      ...this.state.attributes,
      images: props.item.get('images') || []
    };
    this.setState({attributes, errors: props.item.getErrors()});
  }

  componentDidMount() {
    const {executeAction} = this.context;
    const {item, update} = this.props;
    const id = uuid.v4();
    executeAction(readAdminCollectionSuggestionList);
    executeAction(readAdminTagSuggestionList);
    if (!update && item.get('image_urls')) {
      executeAction(uploadImage, {
        id,
        multiple: true,
        parent: {id: item.get('id'), type: 'item'},
        url: item.get('image_urls')[0]
      });
    }
  }

  render() {
    const {admin, adminCollectionSuggestionList, adminTagSuggestionList, id, item, update} = this.props;
    const {attributes} = this.state;
    const isSyncing = item.isSyncing || attributes.images.some(image => image.isSyncing);
    const fields = renderFields('item', this.formSchema, {component: this, validator: this.validator});


    this.formSchema.collections.inputProps.suggestions = adminCollectionSuggestionList;
    this.formSchema.tags.inputProps.suggestions = adminTagSuggestionList;

    return <form className="grabr-form" onSubmit={event => {
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
        this.context.executeAction(createItem, {admin, attributes, id, update});
      }
    }}>
      <fieldset>
        {fields}
      </fieldset>
      <section className="flex-row flex-justify-center controls">
        <SyncButton type="submit" isSyncing={isSyncing}>
          <FormattedMessage id={update ? 'shared.save' : 'shared.continue'}/>
        </SyncButton>
        <Link to="/admin/items" className="transparent link-unstyled">
          <FormattedMessage id="shared.cancel"/>
        </Link>
      </section>
    </form>;
  }
}, [AdminCollectionSuggestionListStore, AdminTagSuggestionListStore, ImageStore, ItemStore], ({getStore}, {id}) => {
  return {
    adminCollectionSuggestionList: getStore(AdminCollectionSuggestionListStore).get().map(collectionShape),
    adminTagSuggestionList: getStore(AdminTagSuggestionListStore).get().map(collectionShape),
    item: getStore(ItemStore).get(id)
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_item-form/ItemForm.js