import React from 'react';

const {object} = React.PropTypes;

/**
 * HTTP request/response context that exists on server only.
 */
export class ServerContext extends React.Component {

  static propTypes = {
    request: object.isRequired,
    response: object.isRequired,
    routingProps: object
  };
  static childContextTypes = {
    request: object.isRequired,
    response: object.isRequired,
    routingProps: object
  };

  getChildContext() {
    const {request, response, routingProps} = this.props;
    return {request, response, routingProps};
  }

  render() {
    return this.props.children;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/ServerContext.js