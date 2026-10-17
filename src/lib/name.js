import { regexDisallowedDisplayNameCharacters, regexSpaceCharacters } from "#src/lib/regex";

/**
 * @function
 * @param {string} value
 * @returns {string}
 */
export function normalizeDisplayName(value) {
  return value.replaceAll(regexDisallowedDisplayNameCharacters, "").replaceAll(regexSpaceCharacters, " ").trim();
}
