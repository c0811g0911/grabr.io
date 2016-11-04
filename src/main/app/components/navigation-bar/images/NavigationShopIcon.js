import React from 'react';
import classNames from 'classnames';

NavigationShopIcon.propTypes = {
  className: React.PropTypes.string
};

export function NavigationShopIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 24 22"
         width="24"
         height="22"
         aria-hidden="true"
         className={classNames('icon icon--navigation-shop', className)}>
      <path d="M20.5,15.2h-2.3V13c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v2.3H15c-0.3,0-0.5,0.2-0.5,0.5
		c0,0.3,0.2,0.5,0.5,0.5h2.3v2.3c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5v-2.3h2.3c0.3,0,0.5-0.2,0.5-0.5
		C21,15.5,20.8,15.2,20.5,15.2z"/>
      <path d="M18.3,9.5v-9C18.3,0.2,18,0,17.8,0H0.5C0.2,0,0,0.2,0,0.5v18.4c0,0.3,0.2,0.5,0.5,0.5h12.2
		c1.1,1.6,3,2.6,5.1,2.6c3.5,0,6.3-2.8,6.3-6.3C24,12.5,21.5,9.8,18.3,9.5z M1,18.4V1h16.3v8.5c-3.2,0.3-5.8,3-5.8,6.2
		c0,1,0.2,1.9,0.6,2.7H1z M17.8,21c-2.9,0-5.3-2.4-5.3-5.3c0-2.9,2.4-5.3,5.3-5.3c2.9,0,5.3,2.4,5.3,5.3C23,18.6,20.7,21,17.8,21z"
      />
      <path d="M13.5,4.7c0.1-0.3-0.1-0.5-0.3-0.6c-0.3-0.1-0.5,0.1-0.6,0.3c-0.4,1.5-1.8,2.5-3.4,2.5s-2.9-1-3.4-2.5
		C5.7,4.1,5.4,4,5.1,4.1C4.9,4.1,4.7,4.4,4.8,4.7c0.6,1.9,2.4,3.2,4.3,3.2C11.1,7.9,12.9,6.6,13.5,4.7z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/app/components/navigation-bar/images/NavigationShopIcon.js