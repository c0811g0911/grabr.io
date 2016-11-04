import React from 'react';

const {shape, string} = React.PropTypes;

export function shapeLocale(locale) {
  if (locale) {
    return locale;
  }
}

export const LocaleShape = shape({
  en: string.isRequired,
  ru: string.isRequired
});



// WEBPACK FOOTER //
// ./src/main/app/models/LocaleModel.js