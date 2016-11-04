import React, {PropTypes} from 'react';
import {Link} from 'react-router/es6';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import {AccountStore} from '../../stores/AccountStore';
import './_send-message.scss';


export class SendMessage extends React.Component {
  static displayName = 'SendMessage';

  static propTypes = {
    grab: PropTypes.any,
    offer: PropTypes.any,
    className: PropTypes.string,
    isHidden: PropTypes.bool,
    isButton: PropTypes.bool,
    outlined: PropTypes.bool
  };

  static defaultProps = {
    isHidden: false,
    isButton: true,
    outlined: false
  };

  static contextTypes = {
    getStore: PropTypes.func.isRequired
  };

  // Helpers
  //
  getCurrentUser() {
    return this.context.getStore(AccountStore).getUser();
  }

  getConversation() {
    if (this.props.offer) {
      return this.props.offer.get('conversation');
    } else if (this.props.grab) {
      return this.props.grab.get('conversation');
    } else {
      throw new Error('unrecognised send message type');
    }
  }

  getAddressee() {
    let {offer, grab} = this.props;

    if (offer) {
      return offer.get('grabber');
    } else if (grab) {
      if (grab.isConsumer(this.getCurrentUser())) {
        return grab.get('accepted_grabber');
      } else {
        return grab.get('consumer');
      }
    } else {
      throw new Error('cannot identify sender');
    }
  }

  // Renderers
  //
  render() {
    const {isButton, outlined, className} = this.props;

    if (this.props.isHidden) {
      return null;
    }

    try {
      return (
        <Link className={classNames({
              'grabr-button': isButton,
              'link-unstyled': true,
              [className]: true,
              'send-message': true,
              outlined: outlined
            })}
            to={
              this.getConversation() ?
                `/conversations/${this.getConversation().get('id')}` :
                `/grabs/${this.props.grab.get('id')}/conversations/new`
            }
        >
            <span className="icon--legacy-messages">
              <FormattedMessage id="components.messenger.message"
                                values={{addressee: this.getAddressee().get('first_name')}}/>
            </span>
        </Link>
      );
    } catch (e) {
      return null;
    }
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_send-message/SendMessage.js