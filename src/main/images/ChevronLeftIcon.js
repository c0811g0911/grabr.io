import classNames from 'classnames';
import React from 'react';

ChevronLeftIcon.propTypes = {
  className: React.PropTypes.string
};

export function ChevronLeftIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 18.9 35.8"
         width="18.9"
         height="35.8"
         aria-hidden="true"
         className={classNames('icon icon--chevron-left', className)}>
      <path d="M17.9,35.8c-0.3,0-0.5-0.1-0.7-0.3L0.3,18.6c-0.4-0.4-0.4-1,0-1.4L17.2,0.3c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4 L2.4,17.9l16.2,16.2c0.4,0.4,0.4,1,0,1.4C18.4,35.7,18.2,35.8,17.9,35.8z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/ChevronLeftIcon.js