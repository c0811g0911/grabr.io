import classNames from 'classnames';
import React from 'react';

GeoPinIcon.propTypes = {
  className: React.PropTypes.string
};

export function GeoPinIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 15 19"
         width="15"
         height="19"
         aria-hidden="true"
         className={classNames('icon icon--geo-pin', className)}>
      <path d="M7.5,19c-0.1,0-0.2,0-0.3-0.1C6.9,18.7,0,14.4,0,7.6C0,3.1,3,0,7.5,0S15,3.1,15,7.6c0,6.8-6.9,11.1-7.2,11.3 C7.7,19,7.6,19,7.5,19z M7.5,1C3.6,1,1,3.6,1,7.6c0,5.6,5.3,9.5,6.5,10.3C8.7,17.1,14,13.2,14,7.6C14,3.6,11.4,1,7.5,1z M7.5,10.5c-1.7,0-3-1.3-3-3s1.3-3,3-3c1.7,0,3,1.3,3,3S9.2,10.5,7.5,10.5z M7.5,5.5c-1.1,0-2,0.9-2,2 s0.9,2,2,2s2-0.9,2-2S8.6,5.5,7.5,5.5z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/GeoPinIcon.js