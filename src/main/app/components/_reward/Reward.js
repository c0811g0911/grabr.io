import React, {PropTypes} from 'react';
import {Money} from '../_money/Money';
import {range} from 'lodash/util';
import classNames from 'classnames';
import './_reward.scss';

const PRICES = [500, 1000, 1500];

const PERCENTAGES = [5, 10, 15];

export class Reward extends React.Component {
  static displayName = 'Reward';

  static propTypes = {
    price: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      selected: null,
      inputValue: ''
    };
  }

  componentDidMount() {
    if (!this.props.value) {
      this.chooseReward(0);
    } else {
      range(0, 3).forEach(index => {
        if (this.props.value === this.getReward(index)) {
          this.chooseReward(index);
        }
      });
    }
  }

  handleRewardChange = value => {
    this.setState({
      selected: null,
      inputValue: value
    });
    this.props.onChange(value);
  };

  isPriceFixed() {
    return this.props.price < 10000;
  }

  getReward(index, price = this.props.price) {
    return this.isPriceFixed() ? PRICES[index] : Math.ceil(PERCENTAGES[index] * price / 10000) * 100;
  }

  chooseReward(index) {
    this.setState({
      selected: index,
      inputValue: ''
    });
    this.props.onChange(this.getReward(index));
  }

  render() {
    return <div className="reward-input">
      <ul>
        {range(0, 3).map(index => <li key={index}>
          <button type="button" className={classNames({
            selected: this.state.selected === index
          })} onClick={this.chooseReward.bind(this, index)}>
            <div>
              <Money value={this.getReward(index)}/>
              {!this.isPriceFixed() && <div className="percentage">
                {PERCENTAGES[index]}%
              </div>}
            </div>
          </button>
        </li>)}
      </ul>
      <Money {...this.props} value={this.state.inputValue} onChange={this.handleRewardChange}/>
    </div>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_reward/Reward.js