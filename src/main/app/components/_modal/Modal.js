import React, {PropTypes} from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {closeModal} from '../../actions/ModalActionCreators';
import {ModalStore} from '../../stores/ModalStore';
import {AppStore} from '../../stores/AppStore';
import './_modal.scss';

class Info extends React.Component {
  static displayName = 'Info';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    message: ''
  };

  // Helpers
  //
  getMessage() {
    return this.context.intl.formatMessage({id: `components.modal_error.${ this.props.type }`}) + ' ' + this.props.message;
  }

  // Handlers
  //
  handleCancel() {
    this.context.executeAction(closeModal);
  }

  // Renderers
  //
  render() {
    return <div className="modal__container">
      <section className="modal__copy">
        {this.getMessage()}
      </section>
      <section>
        <button onClick={this.handleCancel.bind(this)} className="modal__button grabr-button">
          OK
        </button>
      </section>
    </div>;
  }
}

export const Modal = connectToStores(class extends React.Component {
  static displayName = 'Modal';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired
  };

  handleOverlayClick() {
    this.context.executeAction(closeModal);
  }

  handleModalClick(e) {
    e.stopPropagation();
  }

  renderContent() {
    if (this.props.modal.contentCreator) {
      return this.props.modal.contentCreator();
    } else {
      return <Info type={this.props.modal.error} message={this.props.modal.message}/>;
    }
  }

  render() {
    if (!this.props.modal) {
      return null;
    }

    return <div className="grabr-overlay" onClick={this.handleOverlayClick.bind(this)}>
      <div className="grabr-modal" onClick={this.handleModalClick.bind(this)}>
        {this.renderContent()}
      </div>
    </div>;
  }
}, [ModalStore], ({getStore}) => {
  return {
    modal: getStore(ModalStore).getTop()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_modal/Modal.js