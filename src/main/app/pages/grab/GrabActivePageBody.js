import React, {PropTypes} from 'react';
import {Link} from 'react-router/es6';
import {SendMessage} from '../../components/_send-message/SendMessage';
import {UserPreview} from '../../components/_user-preview/UserPreview';
import {OfferEstimate} from '../../components/_offer-estimate/OfferEstimate';
import {cancelOffer, confirmDelivery} from '../../actions/GrabActionCreators';
import {Rating} from '../../components/_rating/Rating';
import {ParticipantPhone} from '../../components/participant-phone/ParticipantPhone';
import {FormattedMessage} from 'react-intl';
import {intercomOpenChat} from '../../utils/IntercomUtils';
import {renderDate} from '../../helpers/renderDate';
import {Modal} from '../../components/modal/Modal';
import moment from 'moment';
import {Confirm} from '../../components/_confirm/Confirm';
import {AccountStore} from '../../stores/AccountStore';
import {GrabReviewForm} from './GrabReviewForm';

import './_grab-active.scss';

export class GrabActivePageBody extends React.Component {
  static displayName = 'GrabActive';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired
  };

  static propTypes = {
    grab: PropTypes.any.isRequired
  };

  // Lifecycle methods
  constructor(props) {
    super(props);

    this.state = this.getStateFromProps(props);
  }

  componentWillReceiveProps(props) {
    this.setState(this.getStateFromProps(props));
  }

  getStateFromProps(props) {
    return {
      consumer: this.props.grab.getConsumer(),
      grabber: this.props.grab.getAcceptedGrabber(),
      offer: this.props.grab.getAcceptedOffer()
    };
  }

  // Helpers
  //
  getCurrentUser() {
    return this.context.getStore(AccountStore).getUser();
  }

  isRelatedToGrab() {
    return this.props.grab.isConsumer(this.getCurrentUser()) ||
           this.props.grab.isAcceptedGrabber(this.getCurrentUser());
  }

  getMessageOffer() {
    if (this.props.grab.isConsumer(this.getCurrentUser())) {
      return this.state.offer;
    }
  }

  getMessageGrab() {
    if (this.props.grab.isAcceptedGrabber(this.getCurrentUser())) {
      return this.props.grab;
    }
  }

  finishGrab() {
    this.context.executeAction(confirmDelivery, {id: this.props.grab.get('id')});
    window.scrollTo(0, 0);
  }

  cancelOffer(offer) {
    this.context.executeAction(cancelOffer, {grabId: this.props.grab.get('id'), offerId: offer.get('id')});
  }

  openHelp(e) {
    e.preventDefault();
    intercomOpenChat();
  }

  // Handlers
  //
  handleCancelOffer(offer) {
    this.setState({showCancelModal: true});
  }

  handleFinishGrab() {
    this.setState({showFinishModal: true});
  }

  // Renderers
  //
  renderCopy() {
    let key;

    if (this.isRelatedToGrab()) {
      if (this.props.grab.isFinished()) {
        key = 'finished';
      } else if (this.props.grab.isAcceptedGrabber(this.getCurrentUser())) {
        key = 'grabber';
      } else if (this.props.grab.isConsumer(this.getCurrentUser())) {
        key = 'consumer';
      }
    } else {
      key = 'rest';
    }

    return <h1 className="font-size-lg"><FormattedMessage id={`pages.grab.active_copy.${ key }`}/></h1>;
  }

  renderCancelOfferButton(offer) {
    if (this.props.grab.isAcceptedGrabber(this.getCurrentUser())) {
      if (!this.props.grab.isDelivered() && !this.props.grab.isFinished()) {
        return <button onClick={this.handleCancelOffer.bind(this, offer)} className="link-button grabr-button">
          <FormattedMessage id="pages.grab.cancel_label"/>
        </button>;
      }
    }
  }

  renderFinishOrderButton() {
    const {grab} = this.props;

    if (!grab.isConsumer(this.getCurrentUser())) {
      return null;
    }
    if (grab.isFinished()) {
      return null;
    }

    return <button onClick={this.handleFinishGrab.bind(this, grab)} className="grabr-button outlined">
      <FormattedMessage id="pages.grab.received_label"/>
    </button>;
  }

  renderReviewForm() {
    if (!this.isRelatedToGrab()) {
      return null;
    }
    if (!this.props.grab.isFinished()) {
      return null;
    }
    if (this.props.grab.hasReview(this.getCurrentUser())) {
      return null;
    }

    return <div>
      <h2 className="grabr-active__header">
        <FormattedMessage id="pages.grab.rate_header"/>
      </h2>
      <GrabReviewForm grab={this.props.grab}/>
    </div>;
  }

  renderReview(review) {
    return <li key={review.get('id')}>
      <b className="name">{review.get('reviewer').getName()}</b>
      <p>{review.get('comment')}</p>
      <Rating value={review.get('rating')}/>
    </li>;
  }

  renderReviews() {
    if (!this.props.grab.isFinished()) {
      return null;
    }
    if (!this.props.grab.hasReview(this.getCurrentUser())) {
      return null;
    }

    return <div>
      <h2 className="grabr-active__header">
        <FormattedMessage id="pages.grab.reviews_header"/>
      </h2>
      <ul className="grabr-reviews">
        {this.props.grab.get('reviews').map(review => this.renderReview(review))}
      </ul>
    </div>;
  }

  renderFindAnotherGrab() {
    if (this.isRelatedToGrab()) {
      return null;
    }

    return <Link className="grabr-button outlined link-unstyled" to="/travel">
      <FormattedMessage id="pages.grab.find_label"/>
    </Link>;
  }

  render() {
    const {grab} = this.props;
    const {grabber, consumer, offer} = this.state;

    return (
      <div className="container-fluid w-100 m-md-b-3 m-md-t-3 m-t-2">
        <h1 className="text-center font-size-xl m-b-2">
          <FormattedMessage id="pages.grab.page_header"/>
        </h1>
        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2 col-lg-8 offset-lg-2
                                        panel panel--legacy panel--xs-top-rounded panel--xs-bottom-rounded text-black p-a-0"
          >
            <div className="grabr-active">
              {this.renderCopy(offer)}
              <section className="info">
                <div>
                  <UserPreview user={grabber} size="medium"/>
                  <div className="city">{grab.getFrom()}</div>
                </div>
                <div className="icon--legacy-airplane">
                <span className="grabr-date">
                  {renderDate(moment(offer.get('delivery_date')))}
                </span>
                </div>
                <div>
                  <UserPreview user={consumer} size="medium"/>
                  <div className="city">{grab.getTo()}</div>
                </div>
              </section>
              <section className="wrapper">
                {this.isRelatedToGrab() && <h2 className="grabr-active__header">
                  <FormattedMessage id="pages.grab.contact_header"/>
                </h2>}
                <SendMessage grab={this.getMessageGrab()}
                             offer={this.getMessageOffer()}
                             className="send-message--row"
                             outlined={true}
                             isButton={false}
                             isHidden={!this.isRelatedToGrab()}/>
                {this.isRelatedToGrab() && !grab.isFinished() &&
                 <ParticipantPhone grabId={grab.get('id')} className="participant-phone--row"/>}
                {this.renderReviews()}
                {this.renderReviewForm()}
                {this.isRelatedToGrab() && <h2 className="grabr-active__header">
                  <FormattedMessage id="pages.grab.receipt_header"/>
                </h2>}
                <OfferEstimate offer={offer} grab={grab}/>
                {this.renderFinishOrderButton()}
                {this.renderFindAnotherGrab()}
                <div className="buttons-secondary">
                  {this.renderCancelOfferButton(offer)}
                  <a href="#" className="link-button link-unstyled grabr-button" onClick={this.openHelp.bind(this)}>
                    Get help
                  </a>
                  <Link className="link-button link-unstyled grabr-button" to="/faq">
                    <FormattedMessage id="shared.faq"/>
                  </Link>
                </div>
              </section>
            </div>
            {this.state.showCancelModal && <Modal>
              <Confirm intlKey="pages.grab.cancel_offer_alert" action={() => {
                this.cancelOffer(offer);
              }} close={() => {
                this.setState({showCancelModal: false});
              }}/>
            </Modal>}
            {this.state.showFinishModal && <Modal>
              <Confirm intlKey="pages.grab.finish_alert" action={() => {
                this.finishGrab();
              }} close={() => {
                this.setState({showFinishModal: false});
              }}/>
            </Modal>}
          </div>
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/main/app/pages/grab/GrabActivePageBody.js