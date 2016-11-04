import classNames from 'classnames';
import React from 'react';

CreditCardIcon.propTypes = {
  className: React.PropTypes.string
};

export function CreditCardIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 34 23"
         width="34"
         height="23"
         aria-hidden="true"
         className={classNames('icon icon--credit-card', className)}>
      <path d="M32,0H2C0.9,0,0,0.9,0,2V21c0,1.1,0.9,2,2,2H32c1.1,0,2-0.9,2-2V9V7V2C34,0.9,33.1,0,32,0z M32,21L32,21H2L2,9 h30V21z M2,7l0-5l30,0v5H2z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/CreditCardIcon.js