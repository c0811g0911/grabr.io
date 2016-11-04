import classNames from 'classnames';
import React from 'react';

CircleMinusIcon.propTypes = {
  className: React.PropTypes.string
};

export function CircleMinusIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 16 16"
         width="16"
         height="16"
         aria-hidden="true"
         className={classNames('icon icon--circle-minus', className)}>
      <path className="icon__shape"
            d="M8,16c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S12.4,16,8,16z M8,1C4.1,1,1,4.1,1,8c0,3.9,3.1,7,7,7 c3.9,0,7-3.1,7-7C15,4.1,11.9,1,8,1z M11,8.5H4.6C4.4,8.5,4.1,8.3,4.1,8s0.2-0.5,0.5-0.5H11c0.3,0,0.5,0.2,0.5,0.5S11.3,8.5,11,8.5z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/CircleMinusIcon.js