import React from 'react';
import classNames from 'classnames';

TwitterIcon.propTypes = {
  className: React.PropTypes.string
};

export function TwitterIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 19.2 15.6"
         width="19.2"
         height="15.6"
         aria-hidden="true"
         className={classNames('icon icon--twitter', className)}>
      <path d="M19.2,1.9c-0.7,0.3-1.5,0.5-2.3,0.6c0.8-0.5,1.4-1.3,1.7-2.2c-0.8,0.5-1.6,0.8-2.5,1C15.5,0.5,14.4,0,13.3,0 c-2.2,0-3.9,1.8-3.9,3.9c0,0.3,0,0.6,0.1,0.9C6.2,4.7,3.3,3.1,1.3,0.7C1,1.3,0.8,2,0.8,2.7c0,1.4,0.7,2.6,1.8,3.3 C1.9,6,1.3,5.8,0.8,5.5c0,0,0,0,0,0.1c0,1.9,1.4,3.5,3.2,3.9c-0.3,0.1-0.7,0.1-1,0.1c-0.3,0-0.5,0-0.7-0.1c0.5,1.6,2,2.7,3.7,2.7 c-1.4,1.1-3.1,1.7-4.9,1.7c-0.3,0-0.6,0-0.9-0.1c1.7,1.1,3.8,1.8,6,1.8c7.3,0,11.2-6,11.2-11.2c0-0.2,0-0.3,0-0.5 C18,3.3,18.7,2.6,19.2,1.9L19.2,1.9z M19.2,1.9"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/TwitterIcon.js