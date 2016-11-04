import React, {PropTypes, Children} from 'react';
import {findDOMNode} from 'react-dom';
import {FormattedMessage} from 'react-intl';


function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}

export class InfiniteScroll extends React.Component {
  static displayName = 'InfiniteScroll';

  static propTypes = {
    pageStart: PropTypes.number,
    hasMore: PropTypes.bool,
    moreButton: PropTypes.bool,
    onScroll: PropTypes.func,
    threshold: PropTypes.number,
    count: PropTypes.number
  };

  static defaultProps = {
    moreButton: false,
    hasMore: false,
    isSyncing: false,
    onScroll: function () {
    },
    threshold: 250
  };

  constructor(props) {
    super(props);

    this.state = {
      buttonClicked: false
    };
  }

  // Lifecycle methods
  //
  componentDidMount() {
    this.scrollHandler = this.handleScroll.bind(this);
    this.attachScrollListener();
  }

  componentDidUpdate(oldProps) {
    if (oldProps.count !== this.props.count ||
        Children.count(oldProps.children) != Children.count(this.props.children)) {
      this.attachScrollListener();
    }
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }

  // Helpers
  //
  showMoreButton() {
    const {hasMore, moreButton} = this.props;

    return !this.state.buttonClicked && hasMore && moreButton;
  }

  handleMoreClick() {
    this.setState({
      buttonClicked: true
    });
    this.handleScroll();
  }

  handleScroll() {
    const el = findDOMNode(this);
    const scrollTop = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement ||
                                                                               document.body.parentNode ||
                                                                               document.body).scrollTop;

    if (topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight < this.props.threshold) {
      this.detachScrollListener();
      // call loadMore after detachScrollListener to allow
      // for non-async loadMore functions
      this.props.onScroll();
    }
  }

  attachScrollListener() {
    if (!this.props.hasMore || this.props.isSyncing || this.binded || this.showMoreButton()) {
      return;
    }

    this.binded = true;
    window.addEventListener('scroll', this.scrollHandler);
    window.addEventListener('resize', this.scrollHandler);
    this.handleScroll();
  }

  detachScrollListener() {
    this.binded = false;
    window.removeEventListener('scroll', this.scrollHandler);
    window.removeEventListener('resize', this.scrollHandler);
  }

  render() {
    const props = this.props;
    const Wrapper = this.props.wrapper;

    return <Wrapper className={this.props.className}>
      {props.children}
      {this.showMoreButton() && !this.props.isSyncing && <div className="p-xs-x-1 p-sm-x-0">
        <button className="btn btn-block btn-outline-primary m-x-auto loader-btn"
                onClick={this.handleMoreClick.bind(this)}>
          <FormattedMessage id="components.sync.more"/>
        </button>
      </div>}
      {props.isSyncing && <div className="loader"><FormattedMessage id="components.sync.loading"/></div>}
    </Wrapper>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_infinite-scroll/InfiniteScroll.js