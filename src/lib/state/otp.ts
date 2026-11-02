import globalState from "#src/lib/state";
import { msToSeconds } from "#src/lib/time";

export interface OtpState {
  /** Email address. */
  email: string;
  /** Expiration time in seconds. */
  expires: number;
  /** Whether the OTP State is blocked and it could not be used until it expires. */
  blocked?: boolean;
  /** Input block time in seconds. */
  inputBlock?: number;
  /** List of invalid OTPs. */
  invalidOtpList?: Set<string>;
  /** Resend block time in seconds. */
  resendBlock?: number;
}

export function clearOldOtpStates(): OtpState[] | null | undefined {
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

export function clearOtpStateList(): void {
  globalState.otp = undefined;
}

export function getCurrentOtpState(): OtpState | undefined {
  return globalState.otp?.at(-1);
}

/**
 * @param email
 */
export function getOtpState(email: string): OtpState | undefined {
  const { otp: otpStateList } = globalState;

  if (!otpStateList?.length) {
    return;
  }

  let otpState: OtpState | undefined;

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
 * @param email
 */
export function switchOtpState(email: string): boolean {
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
