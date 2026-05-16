import profileAttributes from "#shared/profile.json";
import forbiddenProfileNames from "#src/lib/profile/forbidden";

const regexProfile = new RegExp(profileAttributes.regex);

/**
 * @function isProfileNameIdValid
 * @param {string} value
 * @returns {boolean}
 */
export function isProfileNameIdValid(value) {
  return (
    value.length >= profileAttributes.minLength &&
    value.length <= profileAttributes.maxLength &&
    regexProfile.test(value) &&
    !forbiddenProfileNames.has(value)
  );
}
