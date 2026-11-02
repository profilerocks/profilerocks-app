import profileAttributes from "#shared/profile.json";
import forbiddenProfileNames from "#src/lib/profile/forbidden";

export const regexProfile = new RegExp(profileAttributes.regex);

/**
 * @param value
 */
export function isProfileNameIdValid(value: string): boolean {
  return (
    value.length >= profileAttributes.minLength &&
    value.length <= profileAttributes.maxLength &&
    regexProfile.test(value) &&
    !forbiddenProfileNames.has(value)
  );
}
