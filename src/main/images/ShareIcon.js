import classNames from 'classnames';
import React from 'react';

ShareIcon.propTypes = {
  className: React.PropTypes.string
};

export function ShareIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 29 32.4"
         width="29"
         height="32.4"
         aria-hidden="true"
         className={classNames('icon icon--share', className)}>
      <path d="M8,8.5c0.3,0,0.5-0.1,0.7-0.3l4.8-4.8v16c0,0.6,0.4,1,1,1s1-0.4,1-1v-16l4.8,4.8c0.2,0.2,0.5,0.3,0.7,0.3 s0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4l-6.5-6.5c-0.4-0.4-1-0.4-1.4,0L7.3,6.8c-0.4,0.4-0.4,1,0,1.4C7.5,8.4,7.7,8.5,8,8.5z M28,11.4h-8c-0.6,0-1,0.4-1,1s0.4,1,1,1h7v17H2v-17h7c0.6,0,1-0.4,1-1s-0.4-1-1-1H1c-0.6,0-1,0.4-1,1v19 c0,0.6,0.4,1,1,1h27c0.6,0,1-0.4,1-1v-19C29,11.8,28.6,11.4,28,11.4z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/ShareIcon.js