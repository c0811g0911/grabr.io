import React from 'react';
import classNames from 'classnames';

PinterestIcon.propTypes = {
  className: React.PropTypes.string
};

export function PinterestIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 19.3 19.3"
         width="19.3"
         height="19.3"
         aria-hidden="true"
         className={classNames('icon icon--pinterest', className)}>
      <path d="M19.3,9.7c0,5.3-4.3,9.7-9.7,9.7c-1,0-2.1-0.2-3-0.5c1.1-1.2,1.5-3,1.9-4.9c0.8,0.5,1.2,0.9,2.1,1 c3.6,0.3,5.6-3.6,5.1-7.2c-0.4-3.2-3.6-4.8-7-4.4C6.2,3.7,3.6,5.8,3.5,8.9c-0.1,1.9,0.5,3.3,2.2,3.7c0.8-1.4-0.2-1.7-0.4-2.7 c-0.7-4,4.7-6.8,7.5-4c1.9,2,0.7,8-2.5,7.4c-3-0.6,1.5-5.4-0.9-6.3c-1.9-0.8-3,2.3-2,3.9c-0.5,2.5-1.5,4.8-1.3,7.8 c-3.5-1.4-6-4.9-6-9C0,4.3,4.3,0,9.7,0C15,0,19.3,4.3,19.3,9.7z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/PinterestIcon.js