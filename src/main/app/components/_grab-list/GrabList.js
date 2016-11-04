import React, {PropTypes} from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {GrabPreview} from '../_grab-preview/GrabPreview';
import {FormattedMessage} from 'react-intl';
import {InfiniteScroll} from '../_infinite-scroll/InfiniteScroll';
import {Paginator} from '../../utils/Paginator';
import {loadMyGrabs} from '../../actions/GrabActionCreators';
import {
  MyActiveGrabsStore,
  MyPendingGrabsStore,
  MyDraftGrabsStore,
  MyFinishedGrabsStore
} from '../../stores/SequenceStores';
import './_grab-list.scss';


const configs = {
  active: {
    pageSize: null,
    storeName: 'MyActiveGrabsStore',
    action: loadMyGrabs,
    filters: {
      filter: 'active'
    }
  },
  pending: {
    pageSize: null,
    storeName: 'MyPendingGrabsStore',
    action: loadMyGrabs,
    filters: {
      filter: 'pending'
    }
  },
  draft: {
    pageSize: 2,
    storeName: 'MyDraftGrabsStore',
    action: loadMyGrabs,
    filters: {
      filter: 'draft'
    },
    loadRest: true
  },
  finished: {
    pageSize: 2,
    storeName: 'MyFinishedGrabsStore',
    action: loadMyGrabs,
    filters: {
      filter: 'finished'
    },
    loadRest: true
  }
};

export const GrabList = connectToStores(class extends React.Component {
  static displayName = 'GrabList';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired
  };

  static listStatuses = ['active', 'pending', 'draft', 'finished'];

  constructor(props) {
    super(props);

    this.paginators = {};
  }

  componentDidMount() {
    GrabList.listStatuses.forEach(status => {
      this.paginators[status] = new Paginator(this.context, configs[status]);
      this.paginators[status].reload();
    });
  }

  // Helpers
  //
  handleLoadMore(status) {
    this.paginators[status].loadMore();
  }

  // Renderers
  //
  renderGrabs(status) {
    const grabs = this.props.grabs[status];

    if (grabs.length > 0) {
      return grabs.map((grab, index) => {
        return <li key={index}>
          <GrabPreview grab={grab}/>
        </li>;
      });
    } else if (!this.paginators[status].isSyncing()) {
      return <div key={status} className="grabr-placeholder">
        <FormattedMessage id={`pages.user.grabs.${ status }.placeholder`}/>
      </div>;
    }
  }

  renderLists() {
    return GrabList.listStatuses.map(status => <li key={status}>
      <header>
        <h4 className="header-caps">
          <FormattedMessage id={`pages.user.grabs.${ status }.title`}/>
        </h4>
      </header>
      {this.paginators[status] && <InfiniteScroll wrapper={"ul"}
                                                  className="grab-list w-100"
                                                  hasMore={this.paginators[status].hasMore()}
                                                  isSyncing={this.paginators[status].isSyncing()}
                                                  moreButton={true}
                                                  onScroll={this.handleLoadMore.bind(this, status)}>
        {this.renderGrabs(status)}
      </InfiniteScroll>}
    </li>);
  }

  render() {
    return <ul className="my-grabs m-b-0">
      {this.renderLists()}
    </ul>;
  }

}, [
  MyActiveGrabsStore,
  MyPendingGrabsStore,
  MyDraftGrabsStore,
  MyFinishedGrabsStore
], ({getStore}) => {
  return {
    grabs: {
      active: getStore(MyActiveGrabsStore).get(),
      pending: getStore(MyPendingGrabsStore).get(),
      draft: getStore(MyDraftGrabsStore).get(),
      finished: getStore(MyFinishedGrabsStore).get()
    }
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_grab-list/GrabList.js