import React from 'react';
import classNames from 'classnames';
import {ChevronLeftIcon} from '../../../images/ChevronLeftIcon';
import {ChevronRightIcon} from '../../../images/ChevronRightIcon';
import './_picture-list.scss';

export class PictureList extends React.Component {
  static displayName = 'PictureList';

  constructor(props) {
    super(props);
    this.state = {cursor: 0};
  }

  render() {
    const {caption, children, className} = this.props;
    const cursorToPrev = Math.max(0, Math.min(this.state.cursor - 1, children.length - 1));
    const cursorToPrevHidden = this.state.cursor === 0;
    const cursorToNext = Math.max(0, Math.min(this.state.cursor + 1, children.length - 1));
    const cursorToNextHidden = this.state.cursor === children.length - 1;
    return (
      <div className={classNames('picture-list', className)}>
        <div className="picture-list__pictures">
          <button className={classNames('picture-list__cursor-to-prev', {
            'picture-list__cursor-to-prev_hidden': cursorToPrevHidden
          })}
                  onClick={() => this.setState({cursor: cursorToPrev})}>
            <ChevronLeftIcon/>
          </button>
          <button className={classNames('picture-list__cursor-to-next', {
            'picture-list__cursor-to-next_hidden': cursorToNextHidden
          })}
                  onClick={() => this.setState({cursor: cursorToNext})}>
            <ChevronRightIcon/>
          </button>
          {children.map((child, i) =>
            <div key={i} className={classNames('picture-list__picture', {
              'picture-list__picture_cursor': i === this.state.cursor
            })}>
              {child}
            </div>
          )}
          {caption}
        </div>
        <If condition={children.length > 1}>
          <div className="picture-list__picture-handles">
            <div className="panel hidden-md-down">
              {children.map((child, i) => {
                const isCursor = i === this.state.cursor;
                return <button key={i}
                               onClick={() => this.setState({cursor: i})}
                               className={classNames('picture-list__picture-handle', {
                                 'picture-list__picture-handle_cursor': isCursor
                               })}>
                  {child}
                </button>;
              })}
            </div>
          </div>
        </If>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/picture-list/PictureList.js