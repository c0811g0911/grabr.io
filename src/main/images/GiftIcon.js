import classNames from 'classnames';
import React from 'react';

GiftIcon.propTypes = {
  className: React.PropTypes.string
};

export function GiftIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 21.2 23.5"
         width="21.2"
         height="23.5"
         aria-hidden="true"
         className={classNames('icon icon--gift', className)}>
      <path d="M20.7,5.4h-5c0.5-0.5,0.8-1.3,0.8-2V3c0-1.6-1.3-3-3-3h-0.3c-1.1,0-2.1,0.6-2.7,1.5C10,0.6,9,0,7.7,0h0 c-1.8,0-3,1.2-3,3v0.3c0,0.9,0.3,1.6,0.8,2.2h-5C0.2,5.4,0,5.7,0,5.9v7c0,0.3,0.2,0.5,0.5,0.5h1.1V23c0,0.3,0.2,0.5,0.5,0.5h17.1 c0.3,0,0.5-0.2,0.5-0.5v-9.6h1.1c0.3,0,0.5-0.2,0.5-0.5v-7C21.2,5.7,20.9,5.4,20.7,5.4z M13.3,1h0.3c1.1,0,2,0.9,2,2v0.4 c0,1.1-0.9,2-2,2h-2.4V3.2C11.1,2,12.1,1,13.3,1z M5.7,3.2V3c0-1.2,0.8-2,2-2h0c1.4,0,2.4,0.9,2.4,2.2v2.2H7.7 C6.6,5.4,5.7,4.5,5.7,3.2z M1,6.4h6.7h2.4v6H1V6.4z M2.6,13.4h7.5v9.1H2.6V13.4z M18.6,22.5h-7.5v-9.1h7.5V22.5z M20.2,12.4h-9.1v-6 h2.4h6.7V12.4z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/GiftIcon.js