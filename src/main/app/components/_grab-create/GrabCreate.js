import classNames from 'classnames';
import {FormStore} from '../../stores/FormStore';
import moment from 'moment';
import {Money} from '../_money/Money';
import React, {PropTypes} from 'react';
import {renderDelivery} from '../../renderers/grab_delivery';
import {renderDescription} from '../../renderers/grab_description';
import {renderSummary} from '../../renderers/grab_summary';
import {SyncButton} from '../_sync-button/SyncButton';
import {range} from 'lodash/util';
import {connectToStores} from 'fluxible-addons-react';
import {createGrab} from '../../actions/GrabActionCreators';
import {facebookPixelTrackGrabCreationOpened} from '../../../3rd-party/facebook/FacebookPixelEvents';
import {getItemFromUrl} from '../../actions/ItemActionCreators';
import {GrabStore, ItemStore} from '../../stores/DataStores';
import {
  mixpanelPageViewGrabCreationStep1,
  mixpanelPageViewGrabCreationStep2,
  mixpanelPageViewGrabCreationStep3
} from '../../../3rd-party/mixpanel/MixpanelEvents';
import {renderDate} from '../../helpers/renderDate';
import {switchStep, submitForm, resetForm} from '../../actions/FormActionCreators';
import {shapeGrab} from '../../models/GrabModel';
import {AppStore} from '../../stores/AppStore';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import './_grab-create.scss';

var descriptionIconUrl = require('./images/description.svg');
var deliveryIconUrl = require('./images/delivery.svg');
var summaryIconUrl = require('./images/summary.svg');

class SummaryItem extends React.Component {
  static displayName = 'SummaryItem';

  static propTypes = {
    title: PropTypes.any,
    value: PropTypes.any,
    isPrice: PropTypes.bool,
    isDate: PropTypes.bool
  };

  static defaultProps = {
    title: null,
    isPrice: false,
    isDate: false
  };

  render() {
    return (
      <li className={ this.props.className }>
        {
          this.props.title !== null &&
          <span className="title">
            { this.props.title }
          </span>
        }
        <span className={
          classNames({
            value: true,
            single: !this.props.title
          })
        }>
          {
            this.props.isPrice ?
            <Money value={ this.props.value }/> :
            (this.props.isDate ?
             renderDate(moment(this.props.value)) :
             this.props.value)
          }
        </span>
      </li>
    );
  }
}

export const GrabCreate = connectToStores(class extends React.Component {
  static displayName = 'GrabCreate';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      url: this.props.attributes.shop_url || ''
    };
  }

  componentDidMount() {
    const {attributes, step} = this.props;
    const {estimate_price_cents, quantity, itemId, title} = attributes;
    if (step === 0 && !Number.isNaN(Number(itemId))) {
      facebookPixelTrackGrabCreationOpened({
        item: {id: Number(itemId), name: title, quantity},
        total: {amount: estimate_price_cents / 100, currency: 'USD'}
      });
    }
    this.mixpanelTrack(this.props.step);
  }

  componentWillReceiveProps(newProps) {
    // scroll to top on step change
    if (this.props.step !== newProps.step) {
      document.body.scrollTop = 0;
      this.mixpanelTrack(newProps.step);
    }
  }

  componentWillUnmount() {
    this.context.executeAction(resetForm);
  }

  // helpers
  //
  mixpanelTrack(step) {
    if (step === 0) {
      mixpanelPageViewGrabCreationStep1();
    } else if (step === 1) {
      mixpanelPageViewGrabCreationStep2();
    } else if (step === 2) {
      mixpanelPageViewGrabCreationStep3();
    }
  }

  changeUrl(e) {
    this.setState({url: e.target.value});
  }

  findItem(e) {
    e.preventDefault();

    this.context.executeAction(getItemFromUrl, {
      url: this.state.url
    });
  }

  goBack() {
    if (this.props.step === 0) {
      history.back();
    } else {
      this.context.executeAction(switchStep, {step: this.props.step - 1});
    }
  }

  // handlers
  //
  handleStepSubmit(step, e) {
    e.preventDefault();

    if (step === 0) {
      const {title, estimate_price_cents, quantity} = this.props.attributes;
      facebookPixelTrackGrabCreationOpened({
        item: {name: title, quantity},
        // fixme: oh help us god, currency is hardcoded everywhere!!!
        total: {amount: estimate_price_cents / 100, currency: 'USD'}
      });
    }

    this.context.executeAction(submitForm, {
      attributes: this.props.attributes,
      action: createGrab,
      params: {step}
    });
  }

  // renderers
  //
  renderUrlForm() {
    if (this.props.attributes.fromShop) {
      return null;
    }

    return (
      <form
        className="transparent-form"
        onSubmit={ this.findItem.bind(this) }>
        <input
          onChange={ this.changeUrl.bind(this) }
          placeholder={ this.context.intl.formatMessage({id: 'forms.grab.url.placeholder'}) }
          value={ this.state.url }
        />
        <SyncButton
          className="grabr-button outlined"
          type="submit"
          isSyncing={ this.props.isSyncing }
        >
          <FormattedMessage id="forms.grab.url.submit"/>
        </SyncButton>
      </form>
    );
  }

  renderDescription() {
    if (this.props.step !== 0) {
      return null;
    }

    return (
      <div className="grabr-form">
        <div className="highlighted with-header">
          { this.renderSteps() }
          <img src={ descriptionIconUrl }/>
          <h2><FormattedMessage id="forms.grab.steps.0.subtitle"/></h2>
          <p><FormattedMessage id="forms.grab.steps.0.description"/></p>
        </div>
        { this.renderUrlForm() }
        <form
          className="form-wrapper"
          onSubmit={ this.handleStepSubmit.bind(this, 0) }
        >
          {
            renderDescription(this.props.attributes, this.props.errors, {
              properties: this.props.item ? this.props.item.get('properties') : [],
              locale: this.context.getStore(AppStore).getState().language
            })
          }

          <section className="controls-2">
            <SyncButton
              id={`analytics-${this.context.getStore(AppStore).getState().language}-create-grab-description-next`}
              isSyncing={ this.props.isSyncing }
              type="submit">
              <FormattedMessage id="shared.next"/>
            </SyncButton>
            <button
              type="button"
              onClick={ this.goBack.bind(this) }
              className="transparent"
            >
              <FormattedMessage id="shared.back"/>
            </button>
          </section>
        </form>
      </div>
    );
  }

  renderDelivery() {
    if (this.props.step !== 1) {
      return null;
    }

    return (
      <div className="grabr-form">
        <div className="highlighted with-header">
          { this.renderSteps() }
          <img src={ deliveryIconUrl }/>
          <h2><FormattedMessage id="forms.grab.steps.1.subtitle"/></h2>
          <p><FormattedMessage id="forms.grab.steps.1.description"/></p>
        </div>
        <form
          onSubmit={ this.handleStepSubmit.bind(this, 1) }
        >
          { renderDelivery(this.props.attributes, this.props.errors) }

          <section className="controls-2">
            <SyncButton
              id={`analytics-${this.context.getStore(AppStore).getState().language}-create-grab-delivery-next`}
              isSyncing={ this.props.isSyncing }
              type="submit">
              <FormattedMessage id="shared.next"/>
            </SyncButton>
            <button
              type="button"
              onClick={ this.goBack.bind(this) }
              className="transparent"
            >
              <FormattedMessage id="shared.back"/>
            </button>
          </section>
        </form>
      </div>
    );
  }

  renderSummary() {
    if (this.props.step !== 2) {
      return null;
    }

    const grab = this.context.getStore(GrabStore).get(this.props.attributes.id);
    const item = grab.get('item');

    const {allItemsPrice, reward, applicationFee, total} = shapeGrab(grab);

    return (
      <div className="grabr-form">
        <div className="highlighted with-header">
          { this.renderSteps() }
          <img src={ summaryIconUrl }/>
          <h2><FormattedMessage id="forms.grab.steps.2.subtitle"/></h2>
          <p><FormattedMessage id="forms.grab.steps.2.description"/></p>
        </div>
        <ul className="grab-summary">
          <li className="grab-summary-title">
            {
              grab.get('image') &&
              <img src={ grab.get('image').get('url') }/>
            }
            <p>{ item.get('title') }</p>
          </li>
          <SummaryItem value={ item.get('description') }/>
          <SummaryItem
            title={ <FormattedMessage id="forms.grab.summary.quantity"/> }
            value={ grab.get('quantity') }
          />
          <SummaryItem
            title={ <FormattedMessage id="forms.grab.summary.to"/> }
            value={ grab.getTo() }
            className={ classNames({'to': grab.get('from')}) }
          />
          {
            grab.get('from') &&
            <SummaryItem
              title={ <FormattedMessage id="forms.grab.summary.from"/> }
              value={ grab.getFrom() }
              className="from"
            />
          }
          {
            grab.get('due_date') &&
            <SummaryItem
              title={ <FormattedMessage id="forms.grab.summary.due_date"/> }
              value={ grab.get('due_date') }
              isDate
            />
          }
        </ul>
        <div className="form-separator"/>
        <form
          onSubmit={ this.handleStepSubmit.bind(this, 2) }
        >
          { renderSummary(this.props.attributes, this.props.errors) }
          <div className="form-separator"/>
          <ul className="grab-summary">
            <SummaryItem
              title={ <FormattedMessage id="forms.grab.summary.reward"/> }
              value={ reward * 100 }
              isPrice
            />
            <SummaryItem
              title={ <FormattedMessage id="forms.grab.summary.price"/> }
              value={ allItemsPrice * 100 }
              isPrice
            />
            <SummaryItem
              title={ <FormattedMessage id="forms.grab.summary.service"/> }
              value={ applicationFee * 100 }
              isPrice
            />
            <SummaryItem
              title={ <FormattedMessage id="forms.grab.summary.total"/> }
              value={ total * 100 }
              className="highlighted-row"
              isPrice
            />
          </ul>

          <label className="grabr-input grabr-input-agree">
            <FormattedHTMLMessage id="forms.grab.agree"/>
          </label>

          <section className="controls-2">
            <SyncButton
              id={`analytics-${this.context.getStore(AppStore).getState().language}-create-grab-summary-next`}
              isSyncing={ this.props.isSyncing }
              type="submit">
              <FormattedMessage id="shared.next"/>
            </SyncButton>
            <button
              type="button"
              onClick={ this.goBack.bind(this) }
              className="transparent"
            >
              <FormattedMessage id="shared.back"/>
            </button>
          </section>
        </form>
      </div>
    );
  }

  renderSteps() {
    return (
      <ul className="steps">
        {
          range(0, 3).map(step =>
            <li
              key={ step }
              className={
                classNames({
                  transparent: true,
                  current: this.props.step === step
                })
              }
            >
              <FormattedMessage id={`forms.grab.steps.${step}.title`}/>
            </li>
          )
        }
      </ul>
    );
  }

  render() {
    return (
      <div className="grab-create">
        {
          this.props.step < 3 &&
          <header>
            <button
              type="button"
              className="transparent back"
              onClick={ this.goBack.bind(this) }
            />
            <button
              id={`analytics-${this.context.getStore(AppStore).getState().language}-create-grab-next`}
              disabled={ this.props.isSyncing }
              type="button"
              className="transparent next"
              isDefaultButton={ false }
              onClick={ this.handleStepSubmit.bind(this, this.props.step) }>
              <FormattedMessage id="shared.next"/>
            </button>
            <h1>
              <FormattedMessage id="pages.new_grab.page_header"/></h1>
          </header>
        }
        { this.renderDescription() }
        { this.renderDelivery() }
        { this.renderSummary() }
      </div>
    );
  }

}, [FormStore, GrabStore, ItemStore], (context) => {
  const formStore = context.getStore(FormStore);
  const attributes = formStore.getAttributes();

  return {
    item: attributes.itemId ? context.getStore(ItemStore).get(attributes.itemId) : null,
    attributes,
    errors: formStore.getErrors(),
    step: formStore.getStep(),
    isSyncing: formStore.isSyncing()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_grab-create/GrabCreate.js