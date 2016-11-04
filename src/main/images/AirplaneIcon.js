import classNames from 'classnames';
import React from 'react';

AirplaneIcon.propTypes = {
  className: React.PropTypes.string
};

export function AirplaneIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 20.2 20.8"
         width="20.2"
         height="20.8"
         aria-hidden="true"
         className={classNames('icon icon--airplane', className)}>
      <path d="M8.8,20.8c-1.1,0-2.1-0.9-2.1-2.1v-5.6H4.2l-0.7,2.1c-0.2,0.7-0.9,1.2-1.7,1.2c-1,0-1.8-0.8-1.8-1.8V6.1 c0-1,0.8-1.8,1.8-1.8c0.8,0,1.5,0.5,1.7,1.2l0.7,2.1h2.5V2.1C6.8,0.9,7.7,0,8.8,0c0.9,0,1.6,0.5,1.9,1.3l2.5,6.3h4.2 c1.5,0,2.8,1.2,2.8,2.8c0,1.5-1.2,2.8-2.8,2.8h-4.2l-2.5,6.3C10.5,20.3,9.7,20.8,8.8,20.8z M3.9,12.2h3.4c0.3,0,0.5,0.2,0.5,0.5 v6.1c0,0.6,0.5,1.1,1.1,1.1c0.4,0,0.8-0.3,1-0.7l2.6-6.7c0.1-0.2,0.3-0.3,0.5-0.3h4.5c1,0,1.8-0.8,1.8-1.8c0-1-0.8-1.8-1.8-1.8 h-4.5c-0.2,0-0.4-0.1-0.5-0.3L9.8,1.7C9.7,1.3,9.3,1,8.8,1C8.2,1,7.8,1.5,7.8,2.1v6.1c0,0.3-0.2,0.5-0.5,0.5H3.9 c-0.2,0-0.4-0.1-0.5-0.3L2.6,5.8C2.5,5.5,2.2,5.3,1.8,5.3C1.4,5.3,1,5.7,1,6.1v8.6c0,0.4,0.4,0.8,0.8,0.8c0.3,0,0.7-0.2,0.8-0.6 l0.8-2.5C3.5,12.3,3.7,12.2,3.9,12.2z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/AirplaneIcon.js