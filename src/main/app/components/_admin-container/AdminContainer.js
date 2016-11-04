import {Link} from 'react-router/es6';
import React from 'react';

export class AdminContainer extends React.Component {
  static displayName = 'AdminContainer';

  render() {
    const {children, className} = this.props;
    return (
      <div className={`container-fluid w-100 m-md-b-3 m-md-t-3 ${className}`}>
        <div className="row">
          <div className="admin-page col-xs-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2
                                panel panel--legacy panel--xs-top-rounded panel--xs-bottom-rounded text-black p-a-0"
          >
            <nav>
              <Link className="link-unstyled" to="/admin/grabs">Grabs</Link>
              <Link className="link-unstyled" to="/admin/users">Users</Link>
              <Link className="link-unstyled" to="/admin/items">Items</Link>
              <Link className="link-unstyled" to="/admin/collections">Collections</Link>
              <Link className="link-unstyled" to="/admin/tags">Tags</Link>
              <Link className="link-unstyled" to="/admin/banners">Banners</Link>
              <Link className="link-unstyled" to="/admin/promotions">Promo Codes</Link>
            </nav>
            {children}
          </div>
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_admin-container/AdminContainer.js