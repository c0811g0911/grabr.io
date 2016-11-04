import React, { Component, PropTypes } from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {FormattedMessage} from 'react-intl';

import {AppStore} from '../../stores/AppStore';
import {review, cancelReview} from '../../actions/GrabActionCreators';
import {SyncButton} from '../../components/_sync-button/SyncButton';
import {Rating} from '../../components/_rating/Rating';

const formName = 'grabReview';

export const GrabReviewForm = connectToStores(class extends Component {
  static displayName = 'ReviewForm';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  static propTypes = {
    grab: PropTypes.object,
    errors: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      attributes: {},
      errors: {},
      showFinishModal: false,
      showCancelModal: false
    };
  }

  componentWillUnmount() {
    this.context.executeAction(cancelReview, {formName});
  }

  handleSubmit = event => {
    event.preventDefault();

    this.context.executeAction(review, {
      id: this.props.grab.get('id'),
      attributes: this.state.attributes,
      formName
    });
  };

  handleInputChange = event => {
    this.setState(Object.assign(this.state.attributes, {comment: event.target.value}));
  };

  handleValueChange = value => {
    this.setState(Object.assign(this.state.attributes, {rating: value}));
  };

  render() {
    const {errors} = this.props;

    return <form className="grabr-form" onSubmit={this.handleSubmit}>
      <fieldset>
        <div className="grabr-input">
            <span className="span-rating">
              <FormattedMessage id="pages.grab.review.rating_label"/>
            </span>
          <Rating asInput={true}
                  onChange={this.handleValueChange}
                  value={this.state.attributes.rating}/>
        </div>
        <label className="grabr-input">
          <textarea onChange={this.handleInputChange}
                    value={this.state.attributes.comment}
                    placeholder={this.context.intl.formatMessage({id: 'pages.grab.review.comment_placeholder'})}/>
        </label>
      </fieldset>

      <If condition={errors && errors.rating}>
        <div className="text-center text-error">
          <FormattedMessage id={`pages.grab.review.${errors.rating[0]}`}/>
        </div>
      </If>

      <section className="controls review-controls">
        <SyncButton isSyncing={this.props.grab.isSyncing} className="grabr-button">
          <span><FormattedMessage id="shared.submit"/></span>
        </SyncButton>
      </section>
    </form>;
  }
}, [AppStore], context => ({
  errors: context.getStore(AppStore).getFormErrors({formName})
}))



// WEBPACK FOOTER //
// ./src/main/app/pages/grab/GrabReviewForm.js