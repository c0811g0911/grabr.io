import safeJsonStringify from 'json-stringify-safe';

/**
 * Key of the window property where server-side logging records are stored.
 * @type {string}
 */
export const LOG_FIELD = '__log';

/**
 * Returns string with script to populate window object with provided log records.
 *
 * @param {Array.<Object>} log Array of logged payloads. Usually contents of `response.log`.
 * @return {String}
 */
export function createLogScript(log) {
  return `window.${LOG_FIELD}=${safeJsonStringify(log)};`;
}



// WEBPACK FOOTER //
// ./src/main/createLogScript.js