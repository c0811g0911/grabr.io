import React, {PropTypes} from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import './_rating.scss';

export class Rating extends React.Component {
  static displayName = 'Rating';

  static propTypes = {
    asInput: PropTypes.bool,
    onChange: PropTypes.func,
    value: PropTypes.number,
    count: PropTypes.number
  };

  static defaultProps = {
    asInput: false,
    value: 0,
    count: 0
  };

  constructor(props) {
    super(props);

    this.state = {
      hoveredNumber: null
    };
  }

  // Helpers
  //
  getClassName(number) {
    return classNames({
      'icon--legacy-star': true,
      active: this.isActive(number),
      clickable: this.props.asInput
    });
  }

  isActive(number) {
    return (this.state.hoveredNumber || number <= Math.round(this.props.value)) &&
           (!this.state.hoveredNumber || number <= this.state.hoveredNumber);
  }

  // Handlers
  //
  handleRatingClick(value) {
    if (!this.props.asInput) {
      return;
    }

    this.props.onChange(value);
  }

  handleMouseOver(number) {
    if (!this.props.asInput) {
      return;
    }

    this.setState({
      hoveredNumber: number
    });
  }

  handleMouseOut(number) {
    if (!this.props.asInput) {
      return;
    }
    if (this.state.hoveredNumber !== number) {
      return;
    }

    this.setState({
      hoveredNumber: null
    });
  }

  // Renderers
  //
  renderStars() {
    return _.range(1, 6).map(number => {
      return <div key={number}
                  onMouseOver={this.handleMouseOver.bind(this, number)}
                  onMouseOut={this.handleMouseOut.bind(this, number)}
                  onClick={this.handleRatingClick.bind(this, number)}
                  className={this.getClassName(number)}/>;
    });
  }

  renderCount() {
    if (!this.props.count) {
      return null;
    }

    return <span className="count">({this.props.count})</span>;
  }

  render() {
    return <div className="grabr-rating unstyled-link">
      {this.renderStars()}
      {this.renderCount()}
    </div>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_rating/Rating.js