import displayNameAttributes from "#shared/display.json";
import otpAttributes from "#shared/otp.json";
import profileAttributes from "#shared/profile.json";

export const regexBase64Url: RegExp = /^[\w-]+$/;
export const regexDisallowedDisplayNameCharacters: RegExp = new RegExp(displayNameAttributes.regexDisallowed, "gu");
export const regexNotWordsGlobal: RegExp = /\W/g;
export const regexOtp: RegExp = new RegExp(otpAttributes.regex);
export const regexProfile: RegExp = new RegExp(profileAttributes.regex);
export const regexSpaceCharacters: RegExp = /\p{Zs}+/gu;
