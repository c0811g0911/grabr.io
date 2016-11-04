import moment from 'moment';
import React from 'react';

const {object, shape, string} = React.PropTypes;

export function shapeDate(date) {
  if (date) {
    return {
      string: date,
      moment: moment(date)
    };
  }
}

export const DateShape = shape({
  string: string.isRequired,
  moment: object.isRequired
});



// WEBPACK FOOTER //
// ./src/main/app/models/DateModel.js