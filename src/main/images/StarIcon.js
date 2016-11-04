import classNames from 'classnames';
import React from 'react';

StarIcon.propTypes = {
  className: React.PropTypes.string
};

export function StarIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 11.5 11"
         width="11.5"
         height="11"
         aria-hidden="true"
         className={classNames('icon icon--star', className)}>
      <path d="M6,0.2l1.2,3.6C7.2,3.9,7.3,4,7.4,4h3.8c0.3,0,0.4,0.3,0.2,0.5L8.3,6.7C8.2,6.8,8.2,6.9,8.2,7l1.2,3.6 c0.1,0.2-0.2,0.4-0.4,0.3L5.9,8.7c-0.1-0.1-0.2-0.1-0.3,0l-3.1,2.2c-0.2,0.1-0.5-0.1-0.4-0.3L3.3,7c0-0.1,0-0.2-0.1-0.3L0.1,4.5 C-0.1,4.3,0,4,0.3,4h3.8c0.1,0,0.2-0.1,0.2-0.2l1.2-3.6C5.6-0.1,5.9-0.1,6,0.2z"/>
      <path className="icon__accent"
            d="M5.8,0v8.7c-0.1,0-0.1,0-0.2,0L2.5,11c-0.2,0.2-0.5,0-0.4-0.3L3.3,7c0-0.1,0-0.2-0.1-0.3L0.1,4.5 C-0.1,4.3,0,4,0.3,4h3.8c0.1,0,0.2-0.1,0.2-0.2l1.2-3.6C5.6,0.1,5.7,0,5.8,0z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/StarIcon.js