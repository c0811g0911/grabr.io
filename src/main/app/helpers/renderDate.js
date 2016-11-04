export const renderDate = date => {
  return date.format('D MMM');
};

export const renderDateFromNow = date => {
  return date.fromNow();
};

export const renderTime = date => {
  return date.format('HH:mm');
};


// WEBPACK FOOTER //
// ./src/main/app/helpers/renderDate.js