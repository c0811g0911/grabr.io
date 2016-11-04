import classNames from 'classnames';
import React from 'react';

CircleQuestionIcon.propTypes = {
  className: React.PropTypes.string
};

export function CircleQuestionIcon({className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.2"
         viewBox="-1 -1 16.308 16.308"
         width="16.308"
         height="16.308"
         aria-hidden="true"
         className={classNames('icon icon--circle-plus', className)}>
      <circle fill="none" stroke="#66cad8" cx="7.5" cy="7.5" r="7.5"/>
      <path d="M7.485,4.703c-0.6,0-1.049,0.26-1.399,0.74l-0.479-0.53c0.36-0.579,1.079-1.009,1.929-1.009 c1.29,0,2.029,0.789,2.029,1.729c0,1.979-2.199,1.819-1.919,3.338l-0.72,0.011c-0.36-1.859,1.779-1.659,1.779-3.179 C8.705,5.193,8.195,4.703,7.485,4.703z M7.305,9.931c0.31,0,0.53,0.27,0.53,0.529c0,0.3-0.22,0.57-0.53,0.57 c-0.359,0-0.58-0.271-0.58-0.57C6.726,10.2,6.946,9.931,7.305,9.931z"/>
    </svg>
  );
}



// WEBPACK FOOTER //
// ./src/main/images/CircleQuestionIcon.js