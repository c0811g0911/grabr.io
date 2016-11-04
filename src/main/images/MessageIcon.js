import classNames from 'classnames';
import React from 'react';

MessageIcon.propTypes = {
  className: React.PropTypes.string
};

export function MessageIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 22 15"
         width="22"
         height="15"
         aria-hidden="true"
         className={classNames('icon icon--message', className)}>
      <path d="M22,0.5C22,0.5,22,0.5,22,0.5c0-0.1,0-0.1,0-0.2c0,0,0-0.1,0-0.1c0,0,0,0,0-0.1c0,0,0,0,0,0c0,0-0.1,0-0.1-0.1 c0,0,0,0-0.1-0.1c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0c0,0,0,0,0,0h-21c0,0,0,0,0,0c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0c0,0,0,0-0.1,0 c0,0-0.1,0-0.1,0.1c0,0,0,0,0,0c0,0,0,0,0,0.1c0,0,0,0.1,0,0.1c0,0,0,0.1,0,0.1c0,0,0,0,0,0.1v14c0,0.1,0,0.1,0,0.2 c0.1,0.1,0.1,0.2,0.3,0.3c0.1,0,0.1,0,0.2,0h21c0.1,0,0.1,0,0.2,0c0.1-0.1,0.2-0.1,0.3-0.3c0-0.1,0-0.1,0-0.2V0.5z M1,1.5l6.5,5.3 L1,13.3V1.5z M11,8.4L1.9,1h18.2L11,8.4z M8.3,7.4l2.4,2c0,0,0,0,0.1,0c0,0,0,0,0.1,0c0.1,0,0.1,0,0.2,0c0,0,0,0,0,0s0,0,0,0 c0.1,0,0.1,0,0.2,0c0,0,0,0,0.1,0c0,0,0,0,0.1,0l2.4-2l6.6,6.6H1.7L8.3,7.4z M14.5,6.8L21,1.5v11.7L14.5,6.8z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/MessageIcon.js