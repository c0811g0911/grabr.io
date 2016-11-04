import React from 'react';
import {AccountStore} from '../../stores/AccountStore';
import {ChevronRightIcon} from '../../../images/ChevronRightIcon';
import {CircleMinusIcon} from '../../../images/CircleMinusIcon';
import {CirclePlusIcon} from '../../../images/CirclePlusIcon';
import {connectToStores} from 'fluxible-addons-react';
import {DiscussDetailsIcon} from './DiscussDetailsIcon';
import {FacebookSquareIcon} from '../../../images/FacebookSquareIcon';
import {getImageUrl} from '../../utils/ImageUtils';
import {GetOfferIcon} from './GetOfferIcon';
import {GrabCard} from '../../components/grab-card/GrabCard';
import {ItemCard} from '../../components/item-card/ItemCard';
import {ItemStore} from '../../stores/DataStores';
import {loadRelatedGrabs} from '../../actions/GrabActionCreators';
import {loadSimilarItems} from '../../actions/ItemActionCreators';
import {
  mixpanelTrackShare,
  mixpanelClickItemRequestItemItemPage
} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {Picture} from '../../components/picture/Picture';
import {PictureList} from '../../components/picture-list/PictureList';
import {PlaceOrderIcon} from './PlaceOrderIcon';
import {Price} from '../../components/price/Price';
import {shapeGrab, GrabShape} from '../../models/GrabModel';
import {shapeItem, ItemShape} from '../../models/ItemModel';
import {shapeUser, UserShape} from '../../models/UserModel';
import {SimilarItemsStore, RelatedGrabsStore} from '../../stores/SequenceStores';
import {TwitterIcon} from '../../../images/TwitterIcon';
import {FormattedMessage} from 'react-intl';
import URI from 'urijs';
import {Link} from 'react-router/es6';
import './_item.scss';
import {AppStore} from '../../stores/AppStore';
import {normalizeDescription} from '../../utils/TextUtils';
const {arrayOf, func, bool, string, object} = React.PropTypes;

export const Item = connectToStores(class extends React.Component {
  static displayName = 'Item';

  static contextTypes = {
    getStore: func.isRequired,
    executeAction: func.isRequired,
    intl: object.isRequired
  };

  static propTypes = {
    id: string.isRequired,
    item: ItemShape.isRequired,
    similarItems: arrayOf(ItemShape),
    relatedGrabs: arrayOf(GrabShape),
    currentUser: UserShape.isRequired,
    isItemLoaded: bool
  };

  state = {
    quantity: 1,
    properties: {}
  };

  _createShareUrl = () => {
    const utm = {
      'utm_campaign': 'grabr_web',
      'utm_source': 'itemsharing_page'
    };
    return URI.expand('http://grabr.io/items{/id}{?utm*}', {id: this.props.id, utm}).href();
  };

  _onShareFacebook = e => {
    e.preventDefault();
    mixpanelTrackShare('Referral', 'Facebook');
    window.open(`http://www.facebook.com/sharer.php?u=${ encodeURIComponent(this._createShareUrl() +
                                                                            '&utm_medium=facebook') }`, '_blank');
  };

  _onShareTwitter = e => {
    e.preventDefault();
    mixpanelTrackShare('Referral', 'Twitter');
    window.open(new URI('https://twitter.com/intent/tweet').search({
      text: this.context.intl.formatMessage({id: 'pages.item.twitter_message'}) + ' ' + this._createShareUrl() + '&utm_medium=twitter'
    }), '_blank');
  };

  componentDidMount() {
    const {item} = this.props;

    this.context.executeAction(loadSimilarItems, {
      count: 12,
      collectionId: item.collectionId
    });
    this.context.executeAction(loadRelatedGrabs, {count: 4});
  }


  render() {
    const {item, similarItems, relatedGrabs, currentUser} = this.props;
    const appStore = this.context.getStore(AppStore);
    return (
      <div className="item m-t-2 m-b-3">
        <div className="container">

          <section className="row m-b-1">

            <div className="col-xs-12
                          col-md-7
                          col-lg-6 offset-lg-1">


              <PictureList caption={
                <If condition={item.lead && appStore.getTranslation(item.lead)}>
                  <div className="pos-absolute pos-x pos-b bg-transparent-pink text-xs-center p-y-1">
                    {appStore.getTranslation(item.lead)}
                  </div>
                </If>              }>
                {item.imageUrls.map(imageUrl =>
                  <div className="panel panel--sm-top-rounded pos-relative p-a-0">
                    <Picture model={{src: getImageUrl(imageUrl, {size: 'large'})}} className="item__picture"/>
                  </div>
                )}
              </PictureList>

              <div className="panel panel--md-bottom-rounded">
                <h4 className="text-break-word">
                  {item.title}
                </h4>
                <div className="text-break-word" dangerouslySetInnerHTML={{
                  __html: item.description &&
                          normalizeDescription(String(item.description))
                }}/>
              </div>

              <div className="bg-white p-a-1 hidden-md-up">
                <div className="text-uppercase-header text-xs-center m-b-1">
                  <FormattedMessage id="pages.item.share"/>
                </div>

                <div className="flex-row">
                  <a href="#"
                     onClick={this._onShareFacebook}
                     className="item__share-link link-undecorated flex-grow text-xs-center">
                    <FacebookSquareIcon className="m-r-space"/>
                    Facebook
                  </a>
                  <a href="#"
                     onClick={this._onShareTwitter}
                     className="item__share-link link-undecorated flex-grow text-xs-center">
                    <TwitterIcon className="m-r-space"/>
                    Twitter
                  </a>
                </div>
              </div>

            </div>

            <div className="col-xs-12
                          col-md-5
                          col-lg-4">

              <div className="panel panel--md-top-rounded">
                <div className="flex-row flex-items-center flex-justify-between">
                  <div className="text-nowrap font-size-sm">
                    <If condition={item.shopUrl}>
                      <div>
                        <FormattedMessage id="pages.item.price_source"/>
                        <br />
                        <a href={item.shopUrl} className="text-muted m-r-space" target="_blank">
                          {new URI(item.shopUrl).domain()}
                        </a>
                      </div>
                    </If>
                  </div>
                  <Price value={item.price}
                         showRub={appStore.getState().language == 'ru'}
                         currency={item.priceCurrency}/>
                </div>
              </div>

              <div className="panel font-size-sm p-xs-b-0 p-t-1">
                {item.properties.map(({key, label, placeholder}) => <label className="d-block m-b-1">
                  {appStore.getTranslation(label)}
                  <input className="input form-control d-block bg-faded m-t-1"
                         placeholder={appStore.getTranslation(placeholder)}
                         value={this.state.properties[key]}
                         onChange={event => this.setState({
                           properties: {
                             ...this.state.properties,
                             [key]: event.target.value
                           }
                         })}/>
                </label>)}
                <ul className="icon-list w-100">
                  <li className="icon-list__li">
                    <div className="icon-list__li-content">
                        <span className="m-r-space">
                          <FormattedMessage id="pages.item.quantity_label"/>
                        </span>
                      <div className="text-primary pull-xs-right">
                        <button className="btn btn-link text-primary item__quantity-change-btn" onClick={() => {
                          if (this.state.quantity > 0) {
                            this.setState({quantity: this.state.quantity - 1});
                          }
                        }}>
                          <CircleMinusIcon />
                        </button>
                        <span className="m-x-space">
                            {this.state.quantity}
                          </span>
                        <button className="btn btn-link text-primary item__quantity-change-btn" onClick={() => {
                          if (this.state.quantity < 9) {
                            this.setState({quantity: this.state.quantity + 1});
                          }
                        }}>
                          <CirclePlusIcon />
                        </button>
                      </div>
                    </div>
                  </li>

                </ul>
              </div>

              <div className="panel panel--sm-bottom-rounded text-xs-center">
                <Link to={new URI(`/grabs/new`).search({
                                                 quantity: this.state.quantity,
                                                 item_id: item.id, ...this.state.properties
                                               })
                                               .toString()}
                      className="btn btn-block btn-primary m-b-1"
                      onClick={mixpanelClickItemRequestItemItemPage}>
                    <span id={`analytics-${ appStore.getState().language }-order-item`}>
                      <FormattedMessage id="pages.item.order_label"/>
                    </span>
                </Link>
                <div className="text-xs-center">
                  <Link to="/faq" className="text-uppercase font-size-uppercase-xs">
                    <FormattedMessage id="shared.faq"/>
                  </Link>
                </div>
              </div>

              <div className="hidden-sm-down">
                <div className="text-uppercase-header text-xs-center m-y-1">
                  <FormattedMessage id="pages.item.share"/>
                </div>
                <div className="panel panel--sm-top-rounded panel--sm-bottom-rounded flex-row p-a-0">
                  <a href="#"
                     onClick={this._onShareFacebook}
                     className="item__share-link link-undecorated flex-grow text-xs-center p-a-1">
                    <FacebookSquareIcon className="m-r-space"/>
                    Facebook
                  </a>
                  <a href="#"
                     onClick={this._onShareTwitter}
                     className="item__share-link link-undecorated flex-grow text-xs-center p-a-1">
                    <TwitterIcon className="m-r-space"/>
                    Twitter
                  </a>
                </div>
              </div>

              <div className="panel panel--sm-top-rounded panel--sm-bottom-rounded m-t-1">
                <div className="text-uppercase font-size-uppercase-xs">
                  <FormattedMessage id="pages.item.how_grabr_works"/>
                </div>
                <div className="flex-row flex-justify-between font-size-xs text-xs-center m-t-1">
                  <div className="item__step">
                    <div className="item__step-icon">
                      <PlaceOrderIcon />
                    </div>
                    <FormattedMessage id="pages.item.instructions.0"/>
                  </div>
                  <div className="item__step">
                    <div className="item__step-icon">
                      <GetOfferIcon />
                    </div>
                    <FormattedMessage id="pages.item.instructions.1"/>
                  </div>
                  <div className="item__step">
                    <div className="item__step-icon">
                      <DiscussDetailsIcon />
                    </div>
                    <FormattedMessage id="pages.item.instructions.2"/>
                  </div>
                </div>
                <div className="item__about-partner-collection font-size-xs m-t-1 p-t-1 p-b-2">
                  <p className="font-weight-bold">
                    <FormattedMessage id="pages.item.what_happens_when_i_make_order"/>
                  </p>
                  <p className="m-b-0">
                    <FormattedMessage id="pages.item.what_happens_when_i_make_order_answer"/>
                  </p>
                </div>
                <div className="flex-row flex-items-center flex-justify-between m-t-1">
                  <a href="https://grabr.io/blog/heres-how-grabr-is-revolutionizing-the-shopping-abroad-experience"
                     className="font-size-uppercase-xs link-undecorated text-uppercase text-muted">
                    <FormattedMessage id="pages.item.read_more_about_grabr"/>
                  </a>
                  <ChevronRightIcon className="text-muted item__shop-collection-chevron"/>
                </div>
              </div>

            </div>

          </section>
          <If condition={similarItems.length > 0}>
            <section className="row p-xs-x-1 p-sm-x-0">
              <div className="col-xs-12 text-uppercase-header text-xs-center m-b-1">
                <FormattedMessage id="pages.item.similar_items"/>
              </div>
              {similarItems.map((item, key) => <div key={key}
                                                    className={'col-xs-6 col-md-4 col-lg-3 m-b-1' +
                                                               (key >= 4 ? ' hidden-sm-down' : '') +
                                                               (key >= 6 ? ' hidden-md-down' : '')}>
                <ItemCard item={item}/>
              </div>)}
            </section>
          </If>
          <If condition={relatedGrabs.length > 0}>
            <section className="row">
              <div className="col-xs-12 text-uppercase-header text-xs-center m-b-1">
                <FormattedMessage id="pages.item.related_grabs"/>
              </div>
              {relatedGrabs.map((grab, key) => <div key={key} className="col-md-6 col-xs-12 offset-lg-1- m-b-1">
                <GrabCard grab={grab} user={currentUser} mixpanelClickGrabCardPage="Item"/>
              </div>)}
            </section>
          </If>
        </div>
      </div>
    );
  }
}, [AccountStore, ItemStore, RelatedGrabsStore, SimilarItemsStore], ({getStore}, {id}) => {
  return {
    currentUser: shapeUser(getStore(AccountStore).getUser()),
    item: shapeItem(getStore(ItemStore).get(id)),
    relatedGrabs: getStore(RelatedGrabsStore).get().map(shapeGrab),
    similarItems: getStore(SimilarItemsStore).get().map(shapeItem)
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/item/Item.js