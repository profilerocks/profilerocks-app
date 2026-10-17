/**
 * @function compressNumber
 * @param {(number|bigint)} num
 * @returns {string}
 */
export function compressNumber(num) {
  return num.toString(36);
}

/**
 * @function decompressNumber
 * @param {string} compressedNumber
 * @returns {number}
 */
export function decompressNumber(compressedNumber) {
  return parseInt(compressedNumber, 36);
}
