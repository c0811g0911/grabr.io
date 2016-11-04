import {AlertStore} from '../../stores/AlertStore';
import {Avatar} from '../_avatar/Avatar';
import classNames from 'classnames';
import {connectToStores} from 'fluxible-addons-react';
import {hideAlert} from '../../actions/AlertActionCreators';
import {Link} from 'react-router/es6';
import {NotificationPreview} from '../_notification-preview/NotificationPreview';
import React from 'react';
import marked from 'marked';
import {shapeMessage} from '../../models/MessageModel';
import {MessageStore, NotificationStore} from '../../stores/DataStores';
import {FormattedMessage} from 'react-intl';
import {AppStore} from '../../stores/AppStore';

import './_alerts.scss';

const {arrayOf, func, object} = React.PropTypes;

export const Alerts = connectToStores(class extends React.Component {
  static displayName = 'Alerts';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired
  };

  static propTypes = {
    alerts: arrayOf(object)
  };

  renderNotification = notification => {
    const {getStore} = this.context;
    const notification$ = getStore(NotificationStore).get(notification.id);
    return <NotificationPreview notification={notification$}/>;
  };

  renderMessage = message => {
    function trimText(text) {
      return text.length <= 50 ? text : text.substr(0, 40) + '..';
    }

    const {getStore} = this.context;
    const {body, conversationId, sender} = shapeMessage(getStore(MessageStore).get(message.id));
    const renderer = new marked.Renderer();
    renderer.link = (href, title, text) => text;
    renderer.paragraph = text => text;

    return (
      <Link className="link-unstyled" to={`/conversations/${conversationId}`}>
        <aside>
          <Avatar url={sender.avatarUrl}/>
        </aside>
        <section>
          <p>
            <span className="user-name">{sender.firstName}</span>: "{trimText(marked(body, {renderer}))}"
          </p>
        </section>
      </Link>
    );
  };

  renderCustom = type => {
    const messages = this.context.getStore(AppStore).getCurrentIntlMessages();
    if (messages[`components.alerts.${type}`]) {
      return (
        <div className="wrapper">
          <section>
            <p>
              <FormattedMessage id={`components.alerts.${type}`} />
            </p>
          </section>
        </div>
      );
    }
  };

  render() {
    const {alerts} = this.props;
    const {executeAction} = this.context;
    return (
      <ul className="grabr-alerts">
        {
          alerts
            .map(({id, hidden, data: {notification, message, custom, type}}, i) => (
              <li key={i}
                  className={classNames({hidden})}
                  onClick={() => executeAction(hideAlert, {id})}
              >
                <button className="icon--legacy-plus grabr-button outlined"/>
                <Choose>
                  <When condition={notification}>
                    {this.renderNotification(notification)}
                  </When>
                  <When condition={message}>
                    {this.renderMessage(message)}
                  </When>
                  <When condition={custom}>
                    {this.renderCustom(type)}
                  </When>
                </Choose>
              </li>
            ))
        }
      </ul>
    );
  }
}, [AlertStore], ({getStore}) => ({
  alerts: getStore(AlertStore).get()
}));



// WEBPACK FOOTER //
// ./src/main/app/components/_alerts/Alerts.js