/**
 * @callback NumberFunction
 * @param {number} x
 * @returns {number}
 */

/**
 * @function getSecondsFromBase36
 * @param {string} secondsBase36
 * @returns {number}
 */
export function getSecondsFromBase36(secondsBase36) {
  return parseInt(secondsBase36, 36);
}

/**
 * @function msToSeconds
 * @param {number} ms
 * @param {NumberFunction} [roundFunction] - The rounding function to use (e.g., Math.trunc, Math.ceil, Math.round). Defaults to Math.trunc.
 */
export function msToSeconds(ms, roundFunction = Math.trunc) {
  return roundFunction(ms / 1000);
}

/**
 * @function secondsToMs
 * @param {number} seconds
 */
export function secondsToMs(seconds) {
  return seconds * 1000;
}
