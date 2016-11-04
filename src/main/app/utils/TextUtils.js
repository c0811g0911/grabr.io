export const normalizeDescription = (text = '') => text
    .replace(/^\n+|\n+$/g, '')
    .replace(/(.+)(\n{2,})?/g, '<p>$1</p>')
    .replace(/\n/g, '<br/>');



// WEBPACK FOOTER //
// ./src/main/app/utils/TextUtils.js