import globalState from "#src/lib/state";
import { msToSeconds } from "#src/lib/time";

/**
 * @typedef {Object} OtpState
 * @property {string} email - Email address.
 * @property {number} expires - Expiration time in seconds.
 * @property {boolean} [blocked] - Whether the OTP State is blocked and it could not be used until it expires.
 * @property {number} [inputBlock] - Input block time in seconds.
 * @property {Set<string>} [invalidOtpList] - List of invalid OTPs.
 * @property {number} [resendBlock] - Resend block time in seconds.
 */

/**
 * @function clearOldOtpStates
 * @returns {(OtpState[]|null|undefined)}
 */
export function clearOldOtpStates() {
  const { otp: otpStateList } = globalState;

  if (!otpStateList?.length) {
    return otpStateList;
  }

  let writeIndex = 0;

  const dateNowSeconds = msToSeconds(Date.now());

  for (let i = 0; i < otpStateList.length; i++) {
    if (otpStateList[i].expires > dateNowSeconds) {
      otpStateList[writeIndex] = otpStateList[i];
      writeIndex++;
    }
  }

  otpStateList.length = writeIndex;

  return otpStateList;
}

/**
 * @function clearOtpStateList
 */
export function clearOtpStateList() {
  delete globalState.otp;
}

/**
 * @function getCurrentOtpState
 * @returns {(OtpState|undefined)}
 */
export function getCurrentOtpState() {
  return globalState.otp?.at(-1);
}

/**
 * @function getOtpState
 * @param {string} email
 * @returns {(OtpState|undefined)}
 */
export function getOtpState(email) {
  const { otp: otpStateList } = globalState;

  if (!otpStateList?.length) {
    return;
  }

  /**
   * @type {(OtpState|undefined)}
   */
  let otpState;

  let writeIndex = 0;

  const dateNowSeconds = msToSeconds(Date.now());

  for (let i = 0; i < otpStateList.length; i++) {
    if (otpStateList[i].expires > dateNowSeconds) {
      if (!otpState && email === otpStateList[i].email) {
        otpState = otpStateList[i];
      }
      otpStateList[writeIndex] = otpStateList[i];
      writeIndex++;
    }
  }

  otpStateList.length = writeIndex;

  return otpState;
}

/**
 * @function switchOtpState
 * @param {string} email
 * @returns {boolean}
 */
export function switchOtpState(email) {
  const otpStateList = clearOldOtpStates();

  if (!otpStateList?.length) {
    return false;
  }

  const lastIndex = otpStateList.length - 1;

  if (email === otpStateList[lastIndex].email) {
    return true;
  }

  for (let i = lastIndex - 1; i >= 0; i--) {
    const otpToken = otpStateList[i];
    if (email === otpToken.email) {
      otpStateList[i] = otpStateList[lastIndex];
      otpStateList[lastIndex] = otpToken;
      globalState.otpSwitchPending = true;
      return true;
    }
  }

  return false;
}
