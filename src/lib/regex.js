import displayNameAttributes from "#shared/display.json";
import otpAttributes from "#shared/otp.json";
import profileAttributes from "#shared/profile.json";

export const regexBase64Url = /^[\w-]+$/;
export const regexDisallowedDisplayNameCharacters = new RegExp(displayNameAttributes.regexDisallowed, "gu");
export const regexOtp = new RegExp(otpAttributes.regex);
export const regexProfile = new RegExp(profileAttributes.regex);
export const regexSpaceCharacters = /\p{Zs}+/gu;
