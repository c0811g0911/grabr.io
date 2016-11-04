import classNames from 'classnames';
import React from 'react';

CalendarIcon.propTypes = {
  className: React.PropTypes.string
};

export function CalendarIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 19 16.5"
         width="19"
         height="16.5"
         aria-hidden="true"
         className={classNames('icon icon--calendar', className)}>
      <path d="M18.5,1.5h-4v-1C14.5,0.2,14.3,0,14,0s-0.5,0.2-0.5,0.5v1h-8v-1C5.5,0.2,5.3,0,5,0S4.5,0.2,4.5,0.5v1h-4 C0.2,1.5,0,1.7,0,2v14c0,0.3,0.2,0.5,0.5,0.5h18c0.3,0,0.5-0.2,0.5-0.5V2C19,1.7,18.8,1.5,18.5,1.5z M1,2.5h3.5v1C4.5,3.8,4.7,4,5,4 s0.5-0.2,0.5-0.5v-1h8v1C13.5,3.8,13.7,4,14,4s0.5-0.2,0.5-0.5v-1H18v4H1V2.5z M18,15.5H1v-8h17V15.5z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/CalendarIcon.js