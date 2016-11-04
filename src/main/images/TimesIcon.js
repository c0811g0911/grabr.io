import classNames from 'classnames';
import React from 'react';

TimesIcon.propTypes = {
  className: React.PropTypes.string
};

export function TimesIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 10.1 10.1"
         width="10.1"
         height="10.1"
         aria-hidden="true"
         className={classNames('icon icon--times', className)}>
      <path d="M5.7,5l4.2-4.2c0.2-0.2,0.2-0.5,0-0.7S9.4,0,9.2,0.1L5,4.3L0.9,0.1C0.7,0,0.3,0,0.1,0.1S0,0.7,0.1,0.9L4.3,5 L0.1,9.2C0,9.4,0,9.7,0.1,9.9c0.1,0.1,0.2,0.1,0.4,0.1s0.3,0,0.4-0.1L5,5.7l4.2,4.2c0.1,0.1,0.2,0.1,0.4,0.1s0.3,0,0.4-0.1 c0.2-0.2,0.2-0.5,0-0.7L5.7,5z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/TimesIcon.js