import classNames from 'classnames';
import React from 'react';

ChevronRightIcon.propTypes = {
  className: React.PropTypes.string
};

export function ChevronRightIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 18.9 35.8"
         width="18.9"
         height="35.8"
         aria-hidden="true"
         className={classNames('icon icon--chevron-right', className)}>
      <path d="M18.6,17.2L1.7,0.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l16.2,16.2L0.3,34.1c-0.4,0.4-0.4,1,0,1.4 c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l16.9-16.9c0.2-0.2,0.3-0.4,0.3-0.7S18.8,17.4,18.6,17.2z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/ChevronRightIcon.js