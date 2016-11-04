import React from 'react';
import classNames from 'classnames';

NavigationHamburgerIcon.propTypes = {
  className: React.PropTypes.string
};

export function NavigationHamburgerIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="0 0 25 19"
         width="25"
         height="19"
         aria-hidden="true"
         className={classNames('icon icon--navigation-hamburger', className)}>
      <g>
        <g>
          <g>
            <path d="M24.5,1h-24C0.2,1,0,0.8,0,0.5S0.2,0,0.5,0h24C24.8,0,25,0.2,25,0.5S24.8,1,24.5,1z"/>
          </g>
          <g>
            <path d="M24.5,10h-24C0.2,10,0,9.8,0,9.5S0.2,9,0.5,9h24C24.8,9,25,9.2,25,9.5S24.8,10,24.5,10z"/>
          </g>
          <g>
            <path d="M24.5,19h-24C0.2,19,0,18.8,0,18.5S0.2,18,0.5,18h24c0.3,0,0.5,0.2,0.5,0.5S24.8,19,24.5,19z"/>
          </g>
        </g>
        <g>
          <g>
            <path d="M24.5,1h-24C0.2,1,0,0.8,0,0.5S0.2,0,0.5,0h24C24.8,0,25,0.2,25,0.5S24.8,1,24.5,1z"/>
          </g>
          <g>
            <path d="M24.5,10h-24C0.2,10,0,9.8,0,9.5S0.2,9,0.5,9h24C24.8,9,25,9.2,25,9.5S24.8,10,24.5,10z"/>
          </g>
          <g>
            <path d="M24.5,19h-24C0.2,19,0,18.8,0,18.5S0.2,18,0.5,18h24c0.3,0,0.5,0.2,0.5,0.5S24.8,19,24.5,19z"/>
          </g>
        </g>
      </g>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/app/components/navigation-bar/images/NavigationHamburgerIcon.js