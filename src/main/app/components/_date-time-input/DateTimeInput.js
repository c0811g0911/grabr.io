import React from 'react';
import moment from 'moment';
import {Calendar} from '../_calendar/Calendar';
import {Modal} from '../modal/Modal';

const {func, any} = React.PropTypes;

export class DateTimeInput extends React.Component {
  static displayName = 'DateTimeInput';

  static propTypes = {
    onChange: func,
    value: any
  };

  static defaultProps = {
    onChange: function () {
    },
    value: new Date()
  };

  constructor(props) {
    super(props);

    this.state = {
      value: this.getValueFromProps(props),
      showCalendarInput: false
    };
  }

  getValueFromProps(props) {
    let date = moment(props.value);
    if (!date.isValid()) {
      date = moment();
    }

    return date;
  }

  componentWillReceiveProps(nextProps) {
    return this.setState({
      value: this.getValueFromProps(nextProps)
    });
  }

  closeCalendar = () => {
    this.setState({showCalendarInput: false});
  };

  render() {
    return <div className="grabr-date icon--legacy-calendar" onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      this.setState({showCalendarInput: true});
    }}>
      {this.state.value.format('D MMM YYYY')}
      {this.state.showCalendarInput && <Modal>
        <Calendar onChange={value => {
          this.closeCalendar();
          this.props.onChange(value.format('YYYY-MM-DD'));
        }} onCancel={e => {
          e.preventDefault();
          e.stopPropagation();
          this.closeCalendar();
        }} minDate={this.props.minDate} maxDate={this.props.maxDate} selected={this.state.value}/>
      </Modal>}
    </div>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_date-time-input/DateTimeInput.js