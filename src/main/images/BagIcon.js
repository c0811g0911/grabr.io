import classNames from 'classnames';
import React from 'react';

BagIcon.propTypes = {
  className: React.PropTypes.string
};

export function BagIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 28 30.7"
         width="28"
         height="30.7"
         aria-hidden="true"
         className={classNames('icon icon--bag', className)}>
      <path d="M27,0H1C0.4,0,0,0.4,0,1v28.7c0,0.6,0.4,1,1,1h26c0.6,0,1-0.4,1-1V1C28,0.4,27.6,0,27,0z M26,28.7H2V2h24V28.7 z M14,12.5c3.1,0,5.9-2.1,6.8-5.1c0.2-0.5-0.1-1.1-0.7-1.2c-0.5-0.2-1.1,0.1-1.2,0.7c-0.6,2.1-2.7,3.6-4.9,3.6 S9.7,9,9.1,6.9C8.9,6.4,8.4,6.1,7.8,6.2C7.3,6.4,7,6.9,7.2,7.5C8.1,10.5,10.8,12.5,14,12.5z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/BagIcon.js