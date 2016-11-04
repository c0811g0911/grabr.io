import React from 'react';
import classNames from 'classnames';

NavigationNotificationsIcon.propTypes = {
  className: React.PropTypes.string
};

export function NavigationNotificationsIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 21 23.3"
         width="21"
         height="23.3"
         aria-hidden="true"
         className={classNames('icon icon--navigation-notifications', className)}>
      <path d="M20.9,19.8l-2.5-4.9V9.8c0-2.1-0.8-4.1-2.3-5.6c-0.9-0.9-2.1-1.6-3.4-2c0-0.5-0.3-1.1-0.7-1.5
	c-0.4-0.4-1-0.7-1.6-0.7C9.9,0,9.3,0.2,8.9,0.7C8.5,1.1,8.3,1.6,8.2,2.1C7,2.5,5.8,3.2,4.9,4.1C3.4,5.6,2.5,7.6,2.5,9.8v5.1
	l-2.5,4.9C0,20,0,20.2,0.1,20.3c0.1,0.1,0.3,0.2,0.4,0.2h6.8c0.2,1.6,1.6,2.8,3.2,2.8s3-1.2,3.2-2.8h6.8c0.2,0,0.3-0.1,0.4-0.2
	C21,20.2,21,20,20.9,19.8z M5.6,4.8c0.9-0.9,2-1.5,3.3-1.8C9,2.9,9.2,2.7,9.2,2.5V2.3c0-0.3,0.1-0.7,0.4-0.9C9.8,1.1,10.2,1,10.5,1
	s0.7,0.1,0.9,0.4c0.2,0.2,0.4,0.6,0.4,0.9v0.2c0,0.2,0.2,0.4,0.4,0.5c1.2,0.3,2.4,0.9,3.3,1.8c1.3,1.3,2,3.1,2,4.9v4.8H3.5V9.8
	C3.5,7.9,4.3,6.2,5.6,4.8z M13.3,19.5c-0.3,0-0.5,0.2-0.5,0.5c0,1.2-1,2.3-2.3,2.3c-1.2,0-2.3-1-2.3-2.3c0-0.3-0.2-0.5-0.5-0.5H1.3
	l2-4h14.3l2,4H13.3z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/app/components/navigation-bar/images/NavigationNotificationsIcon.js