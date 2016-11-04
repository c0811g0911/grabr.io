import classNames from 'classnames';
import React from 'react';

CirclePlusIcon.propTypes = {
  className: React.PropTypes.string
};

export function CirclePlusIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 24.1 24.1"
         width="24.1"
         height="24.1"
         aria-hidden="true"
         className={classNames('icon icon--circle-plus', className)}>
      <path className="icon__shape"
            d="M12.1,0C5.4,0,0,5.4,0,12.1c0,6.7,5.4,12.1,12.1,12.1c6.7,0,12.1-5.4,12.1-12.1C24.1,5.4,18.7,0,12.1,0z M12.1,23.1C6,23.1,1,18.2,1,12.1C1,6,6,1,12.1,1c6.1,0,11.1,5,11.1,11.1C23.1,18.2,18.2,23.1,12.1,23.1z M17,11.6h-4.4V7.1c0-0.3-0.2-0.5-0.5-0.5s-0.5,0.2-0.5,0.5v4.4H7.1c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5 h4.4V17c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5v-4.4H17c0.3,0,0.5-0.2,0.5-0.5S17.3,11.6,17,11.6z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/CirclePlusIcon.js