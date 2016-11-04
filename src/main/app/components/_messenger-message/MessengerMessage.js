import classNames from 'classnames';
import {ConversationShape} from '../../models/ConversationModel';
import {deleteMessage, resendMessage} from '../../actions/MessageActionCreators';
import marked from 'marked';
import {MessageShape} from '../../models/MessageModel';
import {Modal} from '../modal/Modal';
import {Link} from 'react-router/es6';
import moment from 'moment';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {renderTime} from '../../helpers/renderDate';

const {bool, func} = React.PropTypes;

export class MessengerMessage extends React.Component {
  static displayName = 'MessengerMessage';

  static propTypes = {
    conversation: ConversationShape.isRequired,
    message: MessageShape.isRequired,
    my: bool.isRequired,
    onImageLoad: func
  };

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {showFailModal: false};

    // https://www.npmjs.com/package/marked#overriding-renderer-methods
    this.renderer = new marked.Renderer();
    this.renderer.link = (href, title, text) => {
      return ReactDOMServer.renderToStaticMarkup(<a href={href} title={title} target="_blank">{text}</a>);
    };
  }

  render() {
    const {renderer} = this;
    const {executeAction} = this.context;
    const {conversation, message, my, onImageLoad} = this.props;
    const {body, created, id, imageUrl, isSyncFailed, isSyncing, read, sender} = message;
    const {id: conversationId} = conversation;
    const {showFailModal} = this.state;

    return <li className={classNames({my, failed: isSyncFailed, frameless: imageUrl})}>
      <Link to={`/users/${sender.id}`}
               className="user-pic"
               style={{backgroundImage: `url(${ sender.avatarUrl })`}}/>
      <Choose>
        <When condition={imageUrl}>
          <img src={imageUrl} alt="" onLoad={event => {
            if (onImageLoad) {
              onImageLoad(event);
            }
          }}/>
        </When>
        <Otherwise>
          <div className="message-content" dangerouslySetInnerHTML={{
            __html: marked(body, {renderer})
          }}/>
        </Otherwise>
      </Choose>
      <span className="message-status">
          <span className="grabr-date">
            {renderTime(moment(created))}
          </span>
          <If condition={!isSyncFailed && !isSyncing && my}>
            <Choose>
              <When condition={read}>
                <i className="icon--legacy-read"/>
              </When>
              <Otherwise>
                <i className="icon--legacy-unread"/>
              </Otherwise>
            </Choose>
          </If>
          <Choose>
            <When condition={isSyncing}>
              <i className="icon--legacy-time"/>
            </When>
            <When condition={isSyncFailed}>
              <div>
                <button className="icon--legacy-error-message grabr-button" onClick={() => {
                  this.setState({showFailModal: true});
                }}/>
                <If condition={showFailModal}>
                  <Modal>
                    <div className="modal__container">
                      <section className="modal__copy">
                        <h3>Your message was not sent. Click "Resend" to send this message.</h3>
                        <p>Could not connect to the server.</p>
                      </section>
                      <section>
                        <button className="modal__button grabr-button" onClick={() => {
                          executeAction(resendMessage, {body, conversationId, id});
                          this.setState({showFailModal: false});
                        }}>
                          Resend
                        </button>
                        <button className="modal__button grabr-button" onClick={() => {
                          executeAction(deleteMessage, {conversationId, id});
                          this.setState({showFailModal: false});
                        }}>
                          Delete
                        </button>
                        <button className="modal__button grabr-button" onClick={() => {
                          this.setState({showFailModal: false});
                        }}>
                          Cancel
                        </button>
                      </section>
                    </div>
                  </Modal>
                </If>
              </div>
            </When>
          </Choose>
        </span>
    </li>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_messenger-message/MessengerMessage.js