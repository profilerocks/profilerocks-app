import { bytesToBase64Length } from "#src/lib/base64";
import { regexBase64Url } from "#src/lib/regex";

const DEFAULT_ID_LENGTH = 18;

/**
 * @function isBase64UrlIdValid
 * @param {string} id
 * @param {number} [length] - The length of a correct ID string (24 by default).
 * @returns {boolean}
 */
export function isBase64UrlIdValid(id, length = bytesToBase64Length(DEFAULT_ID_LENGTH)) {
  return id.length === length && regexBase64Url.test(id);
}
