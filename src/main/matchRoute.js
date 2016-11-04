import {match} from 'react-router/es6';

/**
 * Promise flavoured matcher for React Router.
 *
 * @param {Object} options
 * @returns {Promise}
 */
export function matchRoute(options) {
  return new Promise((resolve, reject) => {
    match(options, (error, redirectLocation, routingProps) => {
      if (error) {
        reject(error);
      } else {
        resolve({redirectLocation, routingProps});
      }
    });
  });
}



// WEBPACK FOOTER //
// ./src/main/matchRoute.js