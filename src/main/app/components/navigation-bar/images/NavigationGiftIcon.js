import React from 'react';
import classNames from 'classnames';

NavigationGiftIcon.propTypes = {
  className: React.PropTypes.string
};

export function NavigationGiftIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 20 20.7"
         width="20"
         height="20.7"
         aria-hidden="true"
         className={classNames('icon icon--navigation-gift', className)}>
      <path d="M19.5,4.8h-4.9c0.4-0.5,0.6-1.1,0.6-1.9c0,0,0,0,0,0s0,0,0,0c0-1.7-1.1-2.9-2.6-2.9h-0.1c-1,0-2,0.5-2.5,1.4
	C9.5,0.5,8.6,0,7.6,0v0l0,0C6,0,4.7,1.3,4.7,2.9l0,0c0,0.7,0.3,1.3,0.7,1.8h-5C0.2,4.8,0,5,0,5.2v4.5c0,0.3,0.2,0.5,0.5,0.5h1.4v10
	c0,0.3,0.2,0.5,0.5,0.5h15.2c0.3,0,0.5-0.2,0.5-0.5v-10h1.4c0.3,0,0.5-0.2,0.5-0.5V5.2C20,5,19.8,4.8,19.5,4.8z M12.5,1L12.5,1
	c1.3,0,1.7,1,1.7,1.9c0,0.9-0.5,1.9-1.7,1.9h-2.1V2.9C10.5,1.9,11.4,1,12.5,1z M5.7,2.9L5.7,2.9c0-1.1,0.9-1.9,2-1.9
	c1.1,0,1.9,0.9,1.9,2v1.8H7.7C6.5,4.8,5.7,3.9,5.7,2.9z M1,5.7h6.7h1.9v3.5H1V5.7z M2.9,10.2h6.7v9.5H2.9V10.2z M17.1,19.7h-6.7
	v-9.5h6.7V19.7z M19,9.2h-8.6V5.7h2.1H19V9.2z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/app/components/navigation-bar/images/NavigationGiftIcon.js