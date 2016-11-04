import {Link} from 'react-router/es6';
import React from 'react';
import {AccountStore} from '../../stores/AccountStore';
import {CalendarIcon} from '../../../images/CalendarIcon';
import {canUserCancelGrab} from '../../helpers/canUserCancelGrab';
import {canUserEditGrab} from '../../helpers/canUserEditGrab';
import {canUserMakeOffer} from '../../helpers/canUserMakeOffer';
import {canUserMessageConsumer} from '../../helpers/canUserMessageConsumer';
import {canUserPublishGrab} from '../../helpers/canUserPublishGrab';
import {Confirm} from '../../components/_confirm/Confirm';
import {connectToStores} from 'fluxible-addons-react';
import {FacebookSquareIcon} from '../../../images/FacebookSquareIcon';
import {GeoPinIcon} from '../../../images/GeoPinIcon';
import {getImageUrl} from '../../utils/ImageUtils';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import {GrabCard} from '../../components/grab-card/GrabCard';
import {GrabShape, shapeGrab} from '../../models/GrabModel';
import {GrabStore} from '../../stores/DataStores';
import {AppStore} from '../../stores/AppStore';
import {ItemCard} from '../../components/item-card/ItemCard';
import {ItemShape, shapeItem} from '../../models/ItemModel';
import {loadRelatedGrabs, publishGrab, unpublishGrab, loadGrab} from '../../actions/GrabActionCreators';
import {loadSimilarItems} from '../../actions/ItemActionCreators';
import {MessageIcon} from '../../../images/MessageIcon';
import {
  mixpanelTrackShare,
  mixpanelClickGrabMakeOfferGrabPage
} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {Modal} from '../../components/modal/Modal';
import {Offer} from '../../components/offer/Offer';
import {Picture} from '../../components/picture/Picture';
import {PictureList} from '../../components/picture-list/PictureList';
import {Price} from '../../components/price/Price';
import {QuantityIcon} from '../../../images/QuantityIcon';
import {RelatedGrabsStore, SimilarItemsStore} from '../../stores/SequenceStores';
import {renderDate, renderDateFromNow} from '../../helpers/renderDate';
import {renderFull} from '../../components/price/renderMoney';
import {RouteConnectorIcon} from '../../../images/RouteConnectorIcon';
import {shapeUser, UserShape} from '../../models/UserModel';
import {TwitterIcon} from '../../../images/TwitterIcon';
import URI from 'urijs';
import './_grab.scss';
import {pushHistoryState} from '../../actions/HistoryActionCreators';

async function navigateToGrabEditPage(context, payload) {
  const {executeAction} = context;
  const {grabId} = payload;
  const url = URI.expand('/grabs{/grabId}/edit', {grabId}).href();
  return await executeAction(pushHistoryState, [url]);
}

const {arrayOf, func, object} = React.PropTypes;

export const GrabDefaultPageBody = connectToStores(class extends React.Component {
  static displayName = 'Grab';

  static contextTypes = {
    getStore: func.isRequired,
    executeAction: func.isRequired,
    intl: object.isRequired
  };

  static propTypes = {
    grab: GrabShape.isRequired,
    similarItems: arrayOf(ItemShape),
    relatedGrabs: arrayOf(GrabShape),
    currentUser: UserShape.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showEditModal: false,
      showCancelModal: false
    };
  }

  componentDidMount() {
    const {executeAction} = this.context;
    const {grab} = this.props;
    const {item} = grab;

    if (item.collectionId) {
      executeAction(loadSimilarItems, {
        count: 12,
        collectionId: item.collectionId
      });
    }
    executeAction(loadRelatedGrabs, {count: 4});
  }

  _createShareUrl = () => `http://grabr.io/grabs/${ this.props.grab.id }?utm_source=grab_page&utm_campaign=grabr_web`;

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
      text: this.context.intl.formatMessage({id: 'pages.grab.twitter_message'}) + ' ' + this._createShareUrl() + '&utm_medium=twitter'
    }), '_blank');
  };

  render() {
    const {executeAction} = this.context;
    const {currentUser, grab, relatedGrabs, similarItems} = this.props;
    const {
            allItemsPrice, comment, consumer, createdDate, dueDate, from,
            id, imageUrls, item, offers, quantity, reward, rewardCurrency, title, to
          } = grab;

    return <div className="grab m-t-1 m-b-3">
      <div className="container">

        <section className="row m-b-1">

          <div className="col-xs-12
                          col-md-7
                          col-lg-6 offset-lg-1">

            <PictureList>
              {imageUrls.map(imageUrl =>
                <div className="panel panel--sm-top-rounded p-a-0">
                  <Picture model={{src: getImageUrl(imageUrl, {size: 'large'})}} className="item__picture"/>
                </div>
              )}
            </PictureList>

            <div className="panel panel--md-bottom-rounded">
              <h4 className="text-break-word">
                {title}
              </h4>
              <p className="text-break-word m-b-0">
                {item.description}
              </p>
              {item.properties.map(({label, value}, index) => <p key={index} className="text-break-word m-t-1">
                {this.context.getStore(AppStore).getTranslation(label)}: {value}
              </p>)}
            </div>

            <div className="bg-white p-a-1 hidden-md-up">
              <div className="text-uppercase-header text-xs-center m-b-1">
                Share grab
              </div>

              <div className="flex-row">
                <a href="#"
                   onClick={this._onShareFacebook}
                   className="grab__share-link link-undecorated flex-grow text-xs-center">
                  <FacebookSquareIcon className="m-r-space"/>
                  Facebook
                </a>
                <a href="#"
                   onClick={this._onShareTwitter}
                   className="grab__share-link link-undecorated flex-grow text-xs-center">
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
              <Link className="d-block link-unstyled" to={`/users/${consumer.id}`}>
                <Picture model={{src: getImageUrl(consumer.avatarUrl, {size: 'tiny'})}}
                         className="d-block m-x-auto avatar avatar--xl m-b-1"/>

                <div className="m-b-2 text-xs-center font-size-sm">
                    <span className="m-r-space font-weight-bold">
                      {consumer.fullName}
                    </span>
                  <span className="text-muted">
                      <FormattedMessage id="pages.grab_v2.consumer"/> {renderDateFromNow(createdDate)}
                    </span>
                </div>
              </Link>
              <If condition={canUserMessageConsumer({grab, user: currentUser})}>
                <Link className="grab__message-btn btn btn-block btn-outline-secondary m-b-2"
                      to={grab.conversationId ?
                          `/conversations/${grab.conversationId}` :
                          `/grabs/${grab.id}/conversations/new`
                      }>
                  <MessageIcon className="grab__message-btn-icon"/>
                  <FormattedHTMLMessage id="pages.grab_v2.send_message" values={{name: consumer.firstName}}/>
                </Link>
              </If>
              <div className="flex-row flex-items-center flex-justify-between">
                <div className="text-nowrap font-size-sm">
                  <FormattedMessage id="pages.grab_v2.reward"/>
                  <br />
                  <span className="text-muted m-r-space">
                      <FormattedMessage id="pages.grab_v2.price" values={{quantity}}/>
                    </span>
                  {renderFull(allItemsPrice, 'USD')}
                </div>
                <Price value={reward} currency={rewardCurrency}/>
              </div>
            </div>

            <div className="panel font-size-sm p-xs-y-0">
              <ul className="icon-list w-100">
                <If condition={to}>
                  <li key="0" className="icon-list__li">
                    <div className="icon-list__li-icon">
                      <RouteConnectorIcon className="grab__route-icon text-primary"/>
                    </div>
                    <div className="icon-list__li-content">
                        <span className="text-muted m-r-space">
                          <FormattedMessage id="pages.grab_v2.to"/>
                        </span>
                      <span className="text-primary pull-xs-right">
                        {this.context.getStore(AppStore).getTranslation(to.translations)}
                      </span>
                    </div>
                  </li>
                  <li className="icon-list__li">
                    <div className="icon-list__li-icon"/>
                    <div className="icon-list__li-content">
                        <span className="text-muted m-r-space">
                          <FormattedMessage id="pages.grab_v2.from"/>
                        </span>
                      <span className="text-primary pull-xs-right">
                        <Choose>
                          <When condition={from && from.translations}>
                            {this.context.getStore(AppStore).getTranslation(from.translations)}
                          </When>
                          <Otherwise>
                            {this.context.intl.formatMessage({id: 'shared.anywhere'})}
                          </Otherwise>
                        </Choose>
                      </span>
                    </div>
                  </li>
                </If>
                <If condition={dueDate}>
                  <li className="icon-list__li">
                    <div className="icon-list__li-icon">
                      <CalendarIcon className="text-primary"/>
                    </div>
                    <div className="icon-list__li-content">
                        <span className="text-muted m-r-space">
                          <FormattedMessage id="pages.grab_v2.due_date"/>
                        </span>
                      <span className="text-primary pull-xs-right">
                          {renderDate(dueDate)}
                        </span>
                    </div>
                  </li>
                </If>
                <If condition={item.shopUrl}>
                  <li className="icon-list__li">
                    <div className="icon-list__li-icon">
                      <GeoPinIcon className="text-primary"/>
                    </div>
                    <div className="icon-list__li-content">
                        <span className="text-muted m-r-space">
                          <FormattedMessage id="pages.grab_v2.where_to_buy"/>
                        </span>
                      <a href={item.shopUrl} target="_blank" className="text-primary pull-xs-right">
                        {new URI(item.shopUrl).domain()}
                      </a>
                    </div>
                  </li>
                </If>
                <If condition={quantity > 1}>
                  <li className="icon-list__li">
                    <div className="icon-list__li-icon">
                      <QuantityIcon className="text-primary"/>
                    </div>
                    <div className="icon-list__li-content">
                        <span className="text-muted m-r-space">
                          <FormattedMessage id="pages.grab_v2.quantity"/>
                        </span>
                      <div className="text-primary pull-xs-right">
                        {quantity}
                      </div>
                    </div>
                  </li>
                </If>
              </ul>
            </div>
            <If condition={comment}>
              <div className="panel font-size-sm">
                <p className="text-muted">
                  <FormattedMessage id="pages.grab_v2.comments"/>
                </p>
                <p className="m-b-0">
                  {comment}
                </p>
              </div>
            </If>
            <div className="panel panel--sm-bottom-rounded text-xs-center">
              <If condition={canUserMakeOffer({grab, user: currentUser})}>
                <Link className="btn btn-block btn-primary"
                      to={`/grabs/${id}/offer/new`}
                      onClick={mixpanelClickGrabMakeOfferGrabPage}>
                  <FormattedMessage id="pages.grab_v2.make_offer"/>
                </Link>
              </If>
              <If condition={canUserPublishGrab({grab, user: currentUser})}>
                <button className="btn btn-block btn-primary" onClick={async() => {
                  await executeAction(publishGrab, {grabId: grab.id});
                  executeAction(pushHistoryState, ['/travel']);
                }}>
                  <FormattedMessage id="pages.grab_v2.publish"/>
                </button>
              </If>
              <If condition={canUserEditGrab({grab, user: currentUser})}>
                <button className="btn btn-block btn-primary"
                        onClick={() => {
                          const {grab} = this.props;
                          if (grab.isDraft) {
                            executeAction(navigateToGrabEditPage, {grabId: grab.id});
                          } else {
                            this.setState({showEditModal: true});
                          }
                        }}>
                  <FormattedMessage id="pages.grab_v2.edit"/>
                </button>
                <If condition={this.state.showEditModal}>
                  <Modal>
                    <Confirm intlKey="pages.grab.edit_alert"
                             action={() => executeAction(navigateToGrabEditPage, {grabId: grab.id})}
                             close={() => this.setState({showEditModal: false})}/>
                  </Modal>
                </If>
              </If>
              <If condition={canUserCancelGrab({grab, user: currentUser})}>
                <button className="btn btn-block btn-danger"
                        onClick={() => this.setState({showCancelModal: true})}>
                  <FormattedMessage id="pages.grab_v2.cancel"/>
                </button>
                <If condition={this.state.showCancelModal}>
                  <Modal>
                    <Confirm intlKey="pages.grab.cancel_alert"
                             action={async() => {
                               await executeAction(unpublishGrab, {grabId: grab.id});
                               await new Promise(resolve => {
                                 // note: is needed to remove network lag.
                                 setTimeout(resolve, 1e3);
                               });
                               executeAction(loadGrab, {id: grab.id, loadOffers: true});
                             }}
                             close={() => this.setState({showCancelModal: false})}/>
                  </Modal>
                </If>
              </If>
            </div>

            <div className="hidden-sm-down">
              <div className="text-uppercase-header text-xs-center m-y-1">
                <FormattedMessage id="pages.grab_v2.share"/>
              </div>
              <div className="panel panel--sm-top-rounded panel--sm-bottom-rounded flex-row p-a-0">
                <a href="#"
                   onClick={this._onShareFacebook}
                   className="grab__share-link link-undecorated flex-grow text-xs-center p-a-1">
                  <FacebookSquareIcon className="m-r-space"/>
                  Facebook
                </a>
                <a href="#"
                   onClick={this._onShareTwitter}
                   className="grab__share-link link-undecorated flex-grow text-xs-center p-a-1">
                  <TwitterIcon className="m-r-space"/>
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="row">
          <div className="col-xs-12
                          col-md-7
                          col-lg-6 offset-lg-1
                          text-uppercase-header text-xs-center m-b-1">
            <FormattedMessage id="pages.grab_v2.offers"/>
          </div>
          {offers.map((offer, key) =>
            <div className="col-xs-12
                            col-md-7
                            col-lg-6 offset-lg-1
                            m-b-1">
              <Offer key={key} offer={offer} grab={grab} user={currentUser}/>
            </div>)}
          <If condition={offers.length === 0}>
            <div className="col-xs-12
                           col-md-7
                           col-lg-6 offset-lg-1
                           m-b-1">
              <div className="panel panel--sm-top-rounded panel--sm-bottom-rounded text-xs-center text-muted p-a-2">
                <FormattedMessage id="pages.grab_v2.no_offers"/>
              </div>
            </div>
          </If>
        </section>
        <If condition={relatedGrabs.length > 0}>
          <section className="row">
            <div className="col-xs-12 text-uppercase-header text-xs-center m-b-1">
              <FormattedMessage id="pages.grab_v2.grabs"/>
            </div>
            {relatedGrabs.map((grab, key) => <div key={key} className="col-md-6 col-xs-12 offset-lg-1- m-b-1">
              <GrabCard grab={grab} user={currentUser} mixpanelClickGrabCardPage="Grab"/>
            </div>)}
          </section>
        </If>
        <If condition={similarItems.length > 0}>
          <section className="row p-xs-x-1 p-sm-x-0">
            <div className="col-xs-12 text-uppercase-header text-xs-center m-b-1">
              <FormattedMessage id="pages.grab_v2.items"/>
            </div>
            {similarItems.map((item, key) =>
              <If condition={item.collectionId}>
                <div key={key} className="col-xs-6 col-md-4 col-lg-3 m-b-1">
                  <ItemCard item={item}/>
                </div>
              </If>
            )}
          </section>
        </If>
      </div>
    </div>;
  }
}, [GrabStore, AccountStore, RelatedGrabsStore, SimilarItemsStore], ({getStore}, {id}) => {
  return {
    currentUser: shapeUser(getStore(AccountStore).getUser()),
    grab: shapeGrab(getStore(GrabStore).get(id)),
    relatedGrabs: getStore(RelatedGrabsStore).get().map(shapeGrab),
    similarItems: getStore(SimilarItemsStore).get().map(shapeItem)
  };
});



// WEBPACK FOOTER //
// ./src/main/app/pages/grab/GrabDefaultPageBody.js