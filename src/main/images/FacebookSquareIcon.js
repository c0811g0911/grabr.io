import classNames from 'classnames';
import React from 'react';

FacebookSquareIcon.propTypes = {
  className: React.PropTypes.string
};

export function FacebookSquareIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 19.8 19.8"
         width="19.8"
         height="19.8"
         aria-hidden="true"
         className={classNames('icon icon--facebook-square', className)}>
      <path d="M19.8,0v19.8h-6.5v-7.6h2.6c0.2,0,0.3-0.2,0.3-0.3V9.1c0-0.1,0-0.2-0.1-0.2C16,8.8,16,8.8,15.9,8.8h-2.6V7.2 c0-0.8,0.2-1.2,1.2-1.2L16,6c0.2,0,0.3-0.2,0.3-0.3V3.1c0-0.2-0.1-0.3-0.3-0.3h-2.2c-2.5,0-4,1.6-4,4.2v1.9H7.5 C7.3,8.8,7.2,9,7.2,9.1v2.8c0,0.2,0.2,0.3,0.3,0.3h2.2v7.6H0V0H19.8z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/FacebookSquareIcon.js