const classMap = {
  'Visa': 'visa',
  'MasterCard': 'mastercard',
  'American Express': 'amex',
  'Discover': 'discover',
  'JCB': 'jcb',
  'Diners Club': 'diners'
};

export const getCardCSSName = brand => {
  return classMap[brand] || null;
};


// WEBPACK FOOTER //
// ./src/main/app/helpers/getCardCSSName.js