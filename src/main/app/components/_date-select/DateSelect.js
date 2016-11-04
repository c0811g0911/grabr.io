import React, {PropTypes} from 'react';
import moment from 'moment';
import _, {toArray} from 'lodash';

const startYear = 1900;

export class DateSelect extends React.Component {
  static displayName = 'DateSelect';

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any
  };

  static defaultProps = {
    value: moment()
  };

  constructor(props) {
    super(props);

    this.state = this.getValueFromProps(props);
  }

  componentWillReceiveProps(props) {
    this.setState(this.getValueFromProps(props));
  }

  getValueFromProps(props) {
    return {
      date: moment(props.value)
    };
  }

  // Handlers
  //
  handleDateChange(part, event) {
    this.props.onChange(this.state.date.set(part, +event.target.value).format('YYYY-MM-DD'));
  }

  // Renderers
  //
  renderDayOptions() {
    return _.range(1, this.state.date.daysInMonth() + 1).map(day => {
      return <option key={day} value={day}>
        {day}
      </option>;
    });
  }

  renderMonthOptions() {
    return _.range(12).map(month => {
      return <option key={month} value={month}>
        {moment().month(month).format('MMM')}
      </option>;
    });
  }

  renderYearOptions() {
    return _.range(moment().year() - startYear + 1).map(number => {
      const year = startYear + number;

      return <option key={year} value={year}>
        {year}
      </option>;
    });
  }

  render() {
    return <div className="date-select">
      <select value={this.state.date.date()} onChange={this.handleDateChange.bind(this, 'date')}>
        {this.renderDayOptions()}
      </select>
      <select value={this.state.date.month()} onChange={this.handleDateChange.bind(this, 'month')}>
        {this.renderMonthOptions()}
      </select>
      <select value={this.state.date.year()} onChange={this.handleDateChange.bind(this, 'year')}>
        {this.renderYearOptions()}
      </select>
    </div>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_date-select/DateSelect.js