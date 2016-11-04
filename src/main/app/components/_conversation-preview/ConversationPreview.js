import {Avatar} from '../_avatar/Avatar';
import {ConversationShape} from '../../models/ConversationModel';
import moment from 'moment';
import marked from 'marked';
import {Link} from 'react-router/es6';
import React from 'react';
import {renderDateFromNow} from '../../helpers/renderDate';
import {UserShape} from '../../models/UserModel';

import './_conversation-preview.scss';

export class ConversationPreview extends React.Component {
  static displayName = 'ConversationPreview';

  static propTypes = {
    conversation: ConversationShape.isRequired,
    opposingUser: UserShape.isRequired
  };

  constructor(props) {
    super(props);

    // https://www.npmjs.com/package/marked#overriding-renderer-methods
    this.renderer = new marked.Renderer();
    this.renderer.link = (href, title, text) => text;
    this.renderer.paragraph = text => text;
  }

  render() {
    const {renderer} = this;
    const {conversation, opposingUser} = this.props;
    const {id, lastMessage, title} = conversation;
    return (
      <Link to={`/conversations/${id}`} className="conversation-preview link-unstyled">
        <aside>
          <Avatar url={opposingUser.avatarUrl}/>
        </aside>
        <section>
          <header>
            <h2>{opposingUser.fullName}</h2>
            <If condition={lastMessage}>
                <span className="grabr-date text-nowrap">
                  {renderDateFromNow(moment(lastMessage.created))}
                </span>
            </If>
          </header>
          <p className="grab-title">{title}</p>
          <If condition={lastMessage}>
            <div className="last-message">
              {marked(lastMessage.body, {renderer})}
            </div>
          </If>
        </section>
      </Link>
    );
  }

}



// WEBPACK FOOTER //
// ./src/main/app/components/_conversation-preview/ConversationPreview.js