import React, {PropTypes} from 'react';
import classNames from 'classnames';
import moment from 'moment';
import {closeModal} from '../../actions/ModalActionCreators';
import {FormattedMessage} from 'react-intl';
import './_calendar.scss';


class DayNames extends React.Component {
  static displayName = 'DayNames';

  render() {
    return <div className="week names">
      {moment.weekdaysShort().map(weekday => <span key={weekday} className="day">{weekday}</span>)}
    </div>;
  }
}

class Week extends React.Component {
  static displayName = 'Week';

  isClickable(date) {
    return (!this.props.minDate || date.diff(this.props.minDate) >= 0) &&
           (!this.props.maxDate || date.diff(this.props.maxDate) <= 0);
  }

  onClick(date, e) {
    e.stopPropagation();
    if (!this.isClickable(date)) {
      return;
    }

    this.props.select(date);
  }

  render() {
    let days  = [],
        date  = this.props.date,
        month = this.props.month;

    for (let i = 0; i < 7; i++) {
      const day = {
        name: date.format('dd').substring(0, 1),
        number: date.date(),
        isCurrentMonth: date.month() === month.month(),
        isToday: date.isSame(new Date(), 'day'),
        date: date
      };
      const className = classNames({
        day: true,
        today: day.isToday,
        'different-month': !day.isCurrentMonth,
        disabled: !this.isClickable(day.date),
        clickable: this.isClickable(day.date),
        selected: day.date.isSame(this.props.selected)
      });
      days.push(<span key={day.date.toString()} className={className} onClick={this.onClick.bind(this, day.date)}>
          {day.number}
        </span>);
      date = date.clone();
      date.add(1, 'd');
    }

    return <div className="week days" key={days[0].toString()}>
      {days}
    </div>;
  }
}

export class Calendar extends React.Component {
  static displayName = 'Calendar';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired
  };

  static propTypes = {
    selected: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    minDate: PropTypes.any,
    maxDate: PropTypes.any
  };

  static defaultProps = {
    selected: moment(),
    minDate: null,
    maxDate: null
  };

  handleCloseModal() {
    this.context.executeAction(closeModal);
  }

  constructor(props) {
    super(props);

    this.state = {
      month: props.selected.clone(),
      ...this.getValueFromProps(props)
    };
  }

  componentWillReceiveProps(props) {
    this.setState(this.getValueFromProps(props));
  }

  getValueFromProps({selected}) {
    return {date: selected.clone()};
  }

  previous(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({month: this.state.month.clone().subtract(1, 'M')});
  }

  next(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({month: this.state.month.clone().add(1, 'M')});
  }

  select(day) {
    this.props.onChange(day);
  }

  renderWeeks() {
    let weeks      = [],
        done       = false,
        date       = this.state.month.clone().startOf('month').add('w' - 1).day('Sunday'),
        monthIndex = date.month(),
        count      = 0;

    while (!done) {
      weeks.push(<Week key={date.toString()}
                       date={date.clone()}
                       month={this.state.month}
                       select={this.select.bind(this)}
                       selected={this.state.date}
                       maxDate={this.props.maxDate}
                       minDate={this.props.minDate}/>);

      date.add(1, 'w');
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }

    return weeks;
  }

  render() {
    return <div className="calendar modal__container">
      <div className="header">
        <button type="button" onClick={this.previous.bind(this)}>
          <span className="icon--legacy-arrow-circled-left"/>
        </button>
        <span>{this.state.month.format('MMMM, YYYY')}</span>
        <button type="button" onClick={this.next.bind(this)}>
          <span className="icon--legacy-arrow-circled-right"/>
        </button>
      </div>
      <DayNames />
      {this.renderWeeks()}
      <section>
        <button className="modal__button grabr-button" type="button" onClick={this.props.onCancel}>
          <FormattedMessage id="shared.cancel"/>
        </button>
      </section>
    </div>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_calendar/Calendar.js