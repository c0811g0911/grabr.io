import {AutosizingTextarea} from '../_autosizing-textarea/AutosizingTextarea';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import moment from 'moment';
import {Link} from 'react-router/es6';
import React from 'react';
import {ResponsiveSizes} from '../../utils/ResponsiveSizes';
import {ConversationShape} from '../../models/ConversationModel';
import {createMessage, markConversationAsRead} from '../../actions/MessageActionCreators';
import {find, groupBy, map} from 'lodash/collection';
import {FormattedMessage} from 'react-intl';
import {isSameMessage} from '../../models/MessageModel';
import {isSameUser, UserShape} from '../../models/UserModel';
import {MessengerMessage} from '../_messenger-message/MessengerMessage';
import {ParticipantPhone} from '../participant-phone/ParticipantPhone';
import {postImageAndGetId} from '../../actions/ImageActionCreators';
import './_messenger.scss';

const {func} = React.PropTypes;

export class Messenger extends React.Component {
  static displayName = 'Messenger';

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired
  };

  static propTypes = {
    conversation: ConversationShape.isRequired,
    currentUser: UserShape.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {body: ''};
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    window.dispatchEvent(new Event('resize'));
    if (this.hasUnreadMessages()) {
      this.markAsRead();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.body === this.state.body) {
      this.scrollToPointOfInterest();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.adjustMessagesContainerHeight();
    this.scrollToPointOfInterest();
  };

  adjustMessagesContainerHeight = () => {
    const {form, messagesContainer} = this.refs;
    const header = document.querySelector('.page > header');
    const messengerHeader = document.querySelector('.grabr-messenger > header');
    const title = document.querySelector('.grabr-messenger h1');
    if (window.innerWidth >= ResponsiveSizes.large) {
      messagesContainer.style.minHeight = 'auto';
    } else {
      const messengerHeight = (form ? form.clientHeight : 0) + header.clientHeight + messengerHeader.clientHeight +
                              title.clientHeight;
      messagesContainer.style.minHeight = `${ window.innerHeight - messengerHeight }px`;
    }
  };

  scrollToPointOfInterest() {
    if (this.hasUnreadMessages()) {
      this.scrollToFirstUnreadMessage();
    } else {
      this.scrollToEndOfConversation();
    }
  }

  scrollToFirstUnreadMessage() {
    const {firstUnreadMessage} = this.refs;
    if (firstUnreadMessage) {
      firstUnreadMessage.scrollIntoView();
    }
  }

  scrollToEndOfConversation() {
    const {endOfConversation} = this.refs;
    if (endOfConversation) {
      endOfConversation.scrollIntoView();
    }
  }

  async postImage(image) {
    const {executeAction} = this.context;
    const {conversation} = this.props;

    try {
      const file = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/data_URIs#Syntax
          const dataUrl = /^data:(?:.+?)(?:;base64)?,(.+)$/;
          const b64Image = reader.result.match(dataUrl)[1];
          if (b64Image) {
            resolve(b64Image);
          } else {
            reject();
          }
        });
        reader.addEventListener('error', reject);
        if (image) {
          reader.readAsDataURL(image);
        }
      });
      const imageId = await postImageAndGetId(this.context, {file});
      return await executeAction(createMessage, {conversationId: conversation.id, imageId});
    } catch (error) {
      throw new Error('could not post image');
    }
  }

  async postMessage(message) {
    const {executeAction} = this.context;
    const {conversation} = this.props;

    if (message) {
      this.setState({body: ''});
      return await executeAction(createMessage, {body: message, conversationId: conversation.id});
    } else {
      throw new Error('could not post message');
    }
  }

  isOpponentUnreadMessage = message => {
    const {currentUser} = this.props;
    const {read, sender} = message;
    return !read && !isSameUser(sender, currentUser);
  };

  hasUnreadMessages = () => {
    const {conversation} = this.props;
    const {messages} = conversation;
    return messages.some(this.isOpponentUnreadMessage);
  };

  markAsRead = () => {
    if (this.hasUnreadMessages()) {
      const {executeAction} = this.context;
      const {conversation: {id}} = this.props;
      executeAction(markConversationAsRead, {id});
    }
  };

  render() {
    const {conversation, currentUser} = this.props;
    logger.debug('rendering conversation', conversation)
    const {grab, locked, messages: unorderedMessages, title} = conversation;
    const messages = unorderedMessages.sort(({created: $1}, {created: $2}) => $1.localeCompare($2));
    const firstUnreadMessage = find(messages, this.isOpponentUnreadMessage);
    const messageGroups = groupBy(messages, ({created}) => moment(created).format('DD MM YYYY'));


    let phoneBlock;
    if (grab.isActive) {
      phoneBlock = <div className="grabr-messenger__phone">
        <ParticipantPhone grabId={grab.id}/>
      </div>;
    }

    let lockedAlertBlock;
    let messageFormBlock;
    if (locked) {
      lockedAlertBlock = <div className="locked-alert">
        <FormattedMessage id="components.messenger.locked"/>
      </div>;
    } else {
      messageFormBlock = <form className="flex-rigid" ref="form" onSubmit={event => {
        event.preventDefault();
        this.postMessage(this.state.body);
      }}>
        <Dropzone className="icon--legacy-camera file-dropzone" multiple={false} onDrop={([image]) => {
          this.postImage(image);
        }}/>
        <AutosizingTextarea placeholder="Type message here..." value={this.state.body} onChange={body => {
          this.setState({body});
        }} onKeyDown={event => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.postMessage(this.state.body);
          }
        }}/>
        <button className="transparent" type="submit">
          <FormattedMessage id="components.messenger.send"/>
        </button>
      </form>;
    }

    return (
      <section className={classNames('grabr-messenger flex-col flex-grow', {locked})}>
        <header>
          <h1>
            <Link className="link-unstyled" to={`/grabs/${grab.id}`}>
              {title}
            </Link>
          </h1>
          {phoneBlock}
        </header>
        <div className="grabr-messages flex-grow" ref="messagesContainer">
          <ul>
            {map(messageGroups, (messageGroup, i) => {
              const created = moment(messageGroup[0].created);
              const format = created.year() < moment().year() ? 'DD MMMM YYYY' : 'DD MMMM';
              return [
                <li key={i} className="date">
                  {created.format(format)}
                </li>, messageGroup.map((message, i) => {
                  const messengerMessageBlock = [];
                  if (isSameMessage(message, firstUnreadMessage)) {
                    messengerMessageBlock.push(<li key="firstUnreadMessage" className="unread" ref="firstUnreadMessage">
                      <FormattedMessage id="components.messenger.new_messages"/>
                    </li>);
                  }
                  messengerMessageBlock.push(<MessengerMessage key={i}
                                                               conversation={conversation}
                                                               message={message}
                                                               my={isSameUser(message.sender, currentUser)}
                                                               onImageLoad={() => {
                                                                 if (isSameUser(message.sender, currentUser)) {
                                                                   this.scrollToEndOfConversation();
                                                                 }
                                                               }}/>);
                  return messengerMessageBlock;
                })
              ];
            })}
            <li ref="endOfConversation" className="end-of-conversation"/>
          </ul>
        </div>
        {lockedAlertBlock}
        {messageFormBlock}
      </section>
    );
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_messenger/Messenger.js