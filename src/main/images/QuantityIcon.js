import classNames from 'classnames';
import React from 'react';

QuantityIcon.propTypes = {
  className: React.PropTypes.string
};

export function QuantityIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 15.1 19.7"
         width="15.1"
         height="19.7"
         aria-hidden="true"
         className={classNames('icon icon--quantity', className)}>
      <path d="M14.6,4.7h-3.2V3.8C11.3,1.7,9.6,0,7.5,0S3.7,1.7,3.7,3.8v0.9H0.5C0.2,4.7,0,4.9,0,5.2v14.1 c0,0.3,0.2,0.5,0.5,0.5h14.1c0.3,0,0.5-0.2,0.5-0.5V5.2C15.1,4.9,14.8,4.7,14.6,4.7z M4.7,3.8C4.7,2.2,6,1,7.5,1 c1.5,0,2.8,1.2,2.8,2.8v0.9H4.7V3.8z M14.1,18.7H1V5.7h2.7v1.8C3.7,7.8,4,8,4.2,8s0.5-0.2,0.5-0.5V5.7h5.6v1.8 c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5V5.7h2.7V18.7z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/QuantityIcon.js