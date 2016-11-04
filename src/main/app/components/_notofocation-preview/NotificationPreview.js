import React, {PropTypes} from 'react';
import {Link} from 'react-router/es6';
import {Picture} from '../picture/Picture';
import {Row} from '../_row/Row';
import {FormattedHTMLMessage} from 'react-intl';
import pluralize from 'pluralize';
import {renderDateFromNow} from '../../helpers/renderDate';
import moment from 'moment';
import {AppStore} from '../../stores/AppStore';
import './_notification-preview.scss';


export class NotificationPreview extends React.Component {
  static displayName = 'NotificationPreview';

  static propTypes = {
    notification: PropTypes.any.isRequired,
    withRow: PropTypes.bool
  };

  static contextTypes = {
    getStore: PropTypes.func.isRequired
  };

  static defaultProps = {
    withRow: false
  };

  getText(grab) {
    const subjectName = this.getSubject() ? this.getSubject().get('first_name') : null;
    const messages = this.context.getStore(AppStore).getCurrentIntlMessages();

    if (messages[`pages.notifications.texts.${this.getActionType()}`]) {
      return (
        <FormattedHTMLMessage
          id={`pages.notifications.texts.${this.getActionType()}`}
          values={{
            subjectName,
            grabTitle: grab.get('title'),
            from: grab.getFrom(),
            to: grab.getTo()
          }}
        />
      );
    } else {
      return <FormattedHTMLMessage id="pages.notifications.texts.rest" values={{subjectName}}/>;
    }
  }

  getActionType() {
    return this.props.notification.get('action') + '_' + this.getType();
  }

  getObject() {
    return this.props.notification.get('object');
  }

  getSubject() {
    return this.props.notification.get('subject');
  }

  getType() {
    return pluralize.singular(this.getObject().get('type'));
  }

  renderSubject(grab) {
    if (!this.getSubject()) {
      return null;
    }

    const avatar = this.getSubject().get('avatar');
    const avatarUrl = avatar && avatar.get('url');

    return <aside>
      <Picture model={{src: avatarUrl}} className="avatar"/>
    </aside>;
  }

  renderAlert({grab}) {
    return <Link className="notification-preview link-unstyled" to={`/grabs/${grab.get('id')}`}>
      {this.renderSubject(grab)}
      <section>
        {this.getText(grab)}
        <span className="grabr-date">
            {renderDateFromNow(moment(this.props.notification.get('created')))}
          </span>
      </section>
    </Link>;
  }

  renderOfferAlert() {
    return this.renderAlert({
      grab: this.getObject().get('grab'),
      offer: this.getObject()
    });
  }

  renderGrabAlert() {
    return this.renderAlert({
      grab: this.getObject()
    });
  }

  render() {
    let component;

    try {
      const type = this.getType();

      switch (type) {
        case 'offer':
          component = this.renderOfferAlert();
          break;
        case 'grab':
          component = this.renderGrabAlert();
          break;
        default:
          throw new Error(`Unknown notification type ${ type }`);
      }
    } catch (error) {
      logger.error(error);

      return null;
    }

    if (this.props.withRow) {
      return (
        <Row classNames={{unread: !this.props.notification.get('read')}}>
          {component}
        </Row>
      );
    } else {
      return component;
    }
  }

}



// WEBPACK FOOTER //
// ./src/main/app/components/_notification-preview/NotificationPreview.js