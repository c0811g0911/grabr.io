import React from 'react';
import classNames from 'classnames';

NavigationDeliverIcon.propTypes = {
  className: React.PropTypes.string
};

export function NavigationDeliverIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 24 24.5"
         width="24"
         height="24.5"
         aria-hidden="true"
         className={classNames('icon icon--nav-deliver', className)}>
      <path d="M10.3,24.5c-0.1,0-0.3,0-0.4,0c-0.5-0.1-1-0.3-1.3-0.7C8,23.3,7.8,22.7,7.8,22v-7l-2.9,0c0,0-0.1,0-0.1,0
		l-1,2.5c-0.2,0.7-1,1.3-1.9,1.3c-1.1,0-2-0.8-2-1.8V7.5c0-1,0.9-1.8,2-1.8c0.9,0,1.6,0.5,1.9,1.3l1,2.5c0,0,0,0,0.1,0l2.9,0v-7
		c0-0.7,0.3-1.3,0.7-1.8C8.9,0.4,9.3,0.1,9.8,0c1.2-0.2,2.4,0.5,2.8,1.6l2.7,7.8h6c1.5,0,2.8,1.2,2.8,2.8c0,1.5-1.2,2.8-2.8,2.8h-6
		l-2.7,7.8C12.2,23.9,11.3,24.5,10.3,24.5z M5,14h3.2c0.3,0,0.5,0.2,0.5,0.5V22c0,0.4,0.2,0.8,0.4,1c0.2,0.2,0.5,0.4,0.8,0.4
		c0.7,0.1,1.4-0.3,1.6-1l2.8-8.2c0.1-0.2,0.3-0.3,0.5-0.3h6.3c1,0,1.8-0.8,1.8-1.8c0-1-0.8-1.8-1.8-1.8h-6.3c-0.2,0-0.4-0.1-0.5-0.3
		L11.6,2c-0.2-0.7-0.9-1.1-1.6-1C9.7,1.1,9.4,1.2,9.2,1.4c-0.3,0.3-0.4,0.7-0.4,1V10c0,0.3-0.2,0.5-0.5,0.5l-3.8,0
		c-0.2,0-0.4-0.1-0.5-0.3L2.9,7.3C2.8,7,2.4,6.7,2,6.7c-0.5,0-1,0.4-1,0.8V17c0,0.4,0.4,0.8,1,0.8c0.4,0,0.8-0.2,0.9-0.6L4,14.4
		C4.1,14.1,4.3,14,4.5,14L5,14z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/app/components/navigation-bar/images/NavigationDeliverIcon.js