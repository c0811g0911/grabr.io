import {ImageUpload} from '../_image-upload/ImageUpload';
import {Link} from 'react-router/es6';
import React from 'react';
import {renderFields} from '../../renderers/renderFields';
import {SyncButton} from '../_sync-button/SyncButton';
import {Validator} from '../../utils/Validator';
import {BannerShape, shapeBanner} from '../../models/BannerModel';
import {BannerStore, ImageStore} from '../../stores/DataStores';
import {connectToStores} from 'fluxible-addons-react';
import {createAdminBanner, deleteAdminBanner, updateAdminBanner} from '../../actions/AdminBannerActionCreators';
import {FormattedMessage} from 'react-intl';
import {pushHistoryState} from '../../actions/HistoryActionCreators';


async function createAndNavigateToAdminBannerListPage(context, payload) {
  const {executeAction} = context;
  const {id, image, lead, redTitle, smallTitle, targetUrl, title} = payload;
  await executeAction(createAdminBanner, {id, image, lead, redTitle, smallTitle, targetUrl, title});
  return executeAction(pushHistoryState, ['/admin/banners']);
}

async function updateAndNavigateToAdminBannerListPage(context, payload) {
  const {executeAction} = context;
  const {id, image, lead, redTitle, smallTitle, targetUrl, title} = payload;
  await executeAction(updateAdminBanner, {id, image, lead, redTitle, smallTitle, targetUrl, title});
  return executeAction(pushHistoryState, ['/admin/banners']);
}

async function deleteAndNavigateToAdminBannerListPage(context, payload) {
  const {executeAction} = context;
  const {id} = payload;
  await executeAction(deleteAdminBanner, {id});
  return executeAction(pushHistoryState, ['/admin/banners']);
}

const {bool, func, number, string, oneOfType} = React.PropTypes;

export const AdminBannerForm = connectToStores(class extends React.Component {
  static displayName = 'AdminBannerForm';

  static contextTypes = {
    executeAction: func.isRequired
  };

  static propTypes = {
    adminBanner: BannerShape.isRequired,
    id: oneOfType([number, string]).isRequired,
    isSyncing: bool.isRequired,
    update: bool
  };

  constructor(props) {
    super(props);
    const {adminBanner} = this.props;
    const {image = {}, lead = {}, redTitle = {}, smallTitle = {}, targetUrl, title = {}} = adminBanner;

    this.state = {
      attributes: {
        image,
        leadEn: lead.en,
        leadRu: lead.ru,
        redTitleEn: redTitle.en,
        redTitleRu: redTitle.ru,
        smallTitleEn: smallTitle.en,
        smallTitleRu: smallTitle.ru,
        targetUrl,
        titleEn: title.en,
        titleRu: title.ru
      },
      errors: {}
    };

    this.validator = new Validator(this, {
      image: ['required'],
      leadEn: ['required'],
      leadRu: ['required'],
      smallTitleEn: ['required'],
      smallTitleRu: ['required'],
      titleEn: ['required'],
      titleRu: ['required']
    });

    this.formSchema = function (adminBannerId) {
      return {
        image: {
          label: 'Image',
          input: ImageUpload,
          wrapInDiv: true,
          inputProps: {
            parentId: adminBannerId,
            parentType: 'banners'
          }
        },
        targetUrl: {
          label: 'Target URL'
        },
        titleEn: {
          label: 'Title [en]'
        },
        titleRu: {
          label: 'Title [ru]'
        },
        smallTitleEn: {
          label: 'Small title [en]'
        },
        smallTitleRu: {
          label: 'Small title [ru]'
        },
        redTitleEn: {
          label: 'Red title [en]'
        },
        redTitleRu: {
          label: 'Red title [ru]'
        },
        leadEn: {
          label: 'Lead [en]'
        },
        leadRu: {
          label: 'Lead [ru]'
        }
      };
    };
  }

  componentWillReceiveProps({adminBanner, errors}) {
    const attributes = {
      ...this.state.attributes,
      image: adminBanner.image
    };
    this.setState({attributes, errors});
  }

  render() {
    const {executeAction} = this.context;
    const {id, isSyncing, update} = this.props;
    const {attributes} = this.state;

    return (
      <form className="grabr-form" name="admin_banners" onSubmit={event => {
        event.preventDefault();
        if (this.validator.validateForm()) {
          const payload = {
            id,
            image: attributes.image,
            lead: {
              en: attributes.leadEn,
              ru: attributes.leadRu
            },
            redTitle: attributes.redTitleEn && attributes.redTitleRu ? {
              en: attributes.redTitleEn,
              ru: attributes.redTitleRu
            } : null,
            smallTitle: {
              en: attributes.smallTitleEn,
              ru: attributes.smallTitleRu
            },
            targetUrl: attributes.targetUrl,
            title: {
              en: attributes.titleEn,
              ru: attributes.titleRu
            }
          };
          if (update) {
            executeAction(updateAndNavigateToAdminBannerListPage, payload);
          } else {
            executeAction(createAndNavigateToAdminBannerListPage, payload);
          }
        }
      }}>

        <fieldset>
          <SyncButton className="sync-delete" isSyncing={isSyncing} onClick={() => {
            executeAction(deleteAndNavigateToAdminBannerListPage, {id});
          }}>
            <FormattedMessage id="shared.delete"/>
          </SyncButton>
          {renderFields('admin_banner', this.formSchema(id), {
            component: this,
            validator: this.validator,
            messages: {
              image: {
                required: 'Image must be specified.'
              },
              leadEn: {
                required: "Lead [en] can't be blank."
              },
              leadRu: {
                required: "Lead [ru] can't be blank."
              },
              redTitleEn: {
                required: "Red title [en] can't be blank."
              },
              redTitleRu: {
                required: "Red title [ru] can't be blank."
              },
              smallTitleEn: {
                required: "Small title [en] can't be blank."
              },
              smallTitleRu: {
                required: "Small title [ru] can't be blank."
              },
              targetUrl: {
                required: "Target URL can't be blank."
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
            <FormattedMessage id={`shared.${update ? 'save' : 'create'}`}/>
          </SyncButton>
          <Link to="/admin/banners" className="transparent link-unstyled">
            <FormattedMessage id="shared.cancel"/>
          </Link>
        </section>
      </form>
    );
  }
}, [BannerStore, ImageStore], ({getStore}, {id}) => {
  const adminBanner = getStore(BannerStore).get(id);
  return {
    adminBanner: shapeBanner(adminBanner),
    errors: adminBanner.getErrors(),
    isSyncing: adminBanner.isSyncing
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_admin-banner-form/AdminBannerForm.js