import classNames from 'classnames';
import React from 'react';

RouteConnectorIcon.propTypes = {
  className: React.PropTypes.string
};

export function RouteConnectorIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 17.1 45.4"
         width="17.1"
         height="45.4"
         aria-hidden="true"
         className={classNames('icon icon--route-connector', className)}>
      <path d="M1,22.3v0.8c0,7.9,4.5,15.2,11.5,18.6c-0.2,0.3-0.3,0.6-0.4,0.9C4.7,39.1,0,31.5,0,23.2v-0.8 C0,13.9,4.8,6.2,12.3,2.7c0,0,0.1,0,0.2-0.1c0,0.3,0.2,0.6,0.3,0.9c0,0,0,0-0.1,0.1C5.6,7,1,14.3,1,22.3z"/>
      <path className="icon__accent"
            d="M14.8,0c-1.3,0-2.3,1-2.3,2.3c0,0.1,0,0.2,0,0.4c0,0.3,0.2,0.6,0.3,0.9c0.4,0.6,1.1,1.1,2,1.1 c1.3,0,2.3-1.1,2.3-2.3S16,0,14.8,0z M14.8,3.7c-0.7,0-1.3-0.6-1.3-1.3S14,1,14.8,1c0.7,0,1.3,0.6,1.3,1.3S15.5,3.7,14.8,3.7z"/>
      <path className="icon__accent"
            d="M14.3,40.8c-0.8,0-1.4,0.4-1.9,1c-0.2,0.3-0.3,0.6-0.4,0.9c0,0.1-0.1,0.3-0.1,0.5c0,1.3,1,2.3,2.3,2.3 c1.3,0,2.3-1.1,2.3-2.3S15.6,40.8,14.3,40.8z M14.3,44.4c-0.7,0-1.3-0.6-1.3-1.3s0.6-1.3,1.3-1.3c0.7,0,1.3,0.6,1.3,1.3 S15.1,44.4,14.3,44.4z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/RouteConnectorIcon.js