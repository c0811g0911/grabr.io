import React from 'react';
import classNames from 'classnames';

NavigationMessagesIcon.propTypes = {
  className: React.PropTypes.string
};

export function NavigationMessagesIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 23.7 16.1"
         width="23.7"
         height="16.1"
         aria-hidden="true"
         className={classNames('icon icon--navigation-messages', className)}>
      <path d="M23.7,0.5c0-0.3-0.2-0.5-0.5-0.5H0.5c0,0,0,0,0,0c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0c0,0,0,0-0.1,0
	c0,0-0.1,0-0.1,0.1c0,0,0,0,0,0c0,0,0,0,0,0.1c0,0,0,0.1,0,0.1c0,0,0,0.1,0,0.1c0,0,0,0,0,0.1v15.1c0,0.1,0,0.1,0,0.2
	c0.1,0.1,0.1,0.2,0.3,0.3c0.1,0,0.1,0,0.2,0h22.7c0.1,0,0.1,0,0.2,0c0.1-0.1,0.2-0.1,0.3-0.3c0-0.1,0-0.1,0-0.2V0.5z M1,1.5l7.1,5.8
	L1,14.4V1.5z M11.8,9L1.9,1h19.8L11.8,9z M8.9,7.9l2.6,2.1c0,0,0,0,0.1,0c0,0,0,0,0.1,0c0.1,0,0.1,0,0.2,0c0,0,0,0,0,0s0,0,0,0
	c0.1,0,0.1,0,0.2,0c0,0,0,0,0.1,0c0,0,0,0,0.1,0l2.6-2.1l7.2,7.2H1.7L8.9,7.9z M15.6,7.3l7.1-5.8v12.9L15.6,7.3z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/app/components/navigation-bar/images/NavigationMessagesIcon.js