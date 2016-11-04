/**
 * Key of the window property where client initial state is stored.
 * @type {string}
 */
export const INITIAL_STATE_FIELD = '__initialState';

/**
 * Returns string with script to populate window object with application initial state.
 *
 * @param {Object} store Redux store.
 * @return {String}
 */
export function createInitialStateScript(state) {
  return `window.${INITIAL_STATE_FIELD}=${JSON.stringify(state)};`;
}



// WEBPACK FOOTER //
// ./src/main/createInitialStateScript.js