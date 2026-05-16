"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { proxySet } from "valtio/utils";

import { alertErrorApp } from "#src/lib/alert";
import { decompressNumber } from "#src/lib/compression/number";
import { requestOtpResending } from "#src/lib/request";
import globalState from "#src/lib/state";
import { clearOldOtpStates, clearOtpStateList, getCurrentOtpState } from "#src/lib/state/otp";
import { getSecondsFromBase36 } from "#src/lib/time";

import IconTick from "#src/icons/tick.svg";
import IconUserVerify from "#src/icons/user/verify.svg";

import otpAttributes from "#shared/otp.json";

import Actions from "#src/ui/actions";
import Button from "#src/ui/button";
import InputOtp from "#src/ui/input/otp";
import LinkBack from "#src/ui/link/back";
import LongWord from "#src/ui/text/long";

import styles from "./index.module.scss";

/**
 * @import {OtpState} from "#src/lib/state/otp"
 */

/**
 * @callback AfterVerification
 * @param {Response} res
 */

/**
 * @async
 * @callback RequestOtpVerification
 * @param {string} otp
 * @param {string} [email]
 * @returns {Promise<Response|undefined>}
 */

const ContextHrefBack = createContext("/u/enter");

/**
 * @function otpInputBlockCounter
 * @param {number} prev
 * @returns {number}
 */
function otpInputBlockCounter(prev) {
  if (prev > 1) {
    return prev - 1;
  }

  delete getCurrentOtpState()?.inputBlock;

  return 0;
}

/**
 * @function ReactiveLinkBack
 * @returns {React.ReactNode}
 */
function ReactiveLinkBack() {
  const hrefBack = useContext(ContextHrefBack);

  return <LinkBack href={hrefBack}>Back</LinkBack>;
}

/**
 * @function FormOtpContent
 * @param {Object} props
 * @param {boolean} props.submitting
 * @returns {React.ReactNode}
 */
function FormOtpContent({ submitting }) {
  /**
   * @type {OtpState}
   */
  // @ts-expect-error: Current OTP State is defined.
  const currentOtpState = getCurrentOtpState();

  const currentOtpStateReactive = useSnapshot(currentOtpState);
  const [otp, setOtp] = useState("");
  const [inputBlockRemainingSeconds, setInputBlockRemainingSeconds] = useState(0);

  const otpInputBlock = Boolean(currentOtpStateReactive.inputBlock);
  const otpValid = otp.length === otpAttributes.length ? !currentOtpStateReactive.invalidOtpList?.has(otp) : undefined;

  useEffect(() => {
    if (!currentOtpStateReactive.inputBlock) {
      return;
    }

    const remainingSeconds = currentOtpStateReactive.inputBlock - Math.trunc(Date.now() / 1000);

    if (remainingSeconds <= 0) {
      return;
    }

    setInputBlockRemainingSeconds(remainingSeconds);

    const interval = setInterval(() => {
      setInputBlockRemainingSeconds(otpInputBlockCounter);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [currentOtpStateReactive.inputBlock]);

  useEffect(() => {
    setOtp("");
  }, [currentOtpStateReactive.expires]);

  /**
   * @function setOtpOnChange
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  function setOtpOnChange(event) {
    setOtp(event.currentTarget.value.toLowerCase());
  }

  return (
    <>
      <div className={styles["container-otp"]}>
        {otpInputBlock && (
          <p className={styles["p-blocked"]}>
            You have been temporarily blocked<strong>{inputBlockRemainingSeconds}</strong>
          </p>
        )}
        <InputOtp disabled={otpInputBlock} name="otp" onChange={setOtpOnChange} required valid={otpValid} value={otp} />
      </div>
      <Actions>
        <ReactiveLinkBack />
        <Button disabled={submitting || otpInputBlock || !otpValid} title={submitting ? "Submitting..." : undefined} type="submit">
          Verify
          <IconUserVerify width="1.25em" />
        </Button>
      </Actions>
    </>
  );
}

/**
 * @function ResendButton
 * @param {Object} props
 * @param {boolean} props.submitting
 * @param {function(boolean): void} props.setSubmitting
 * @returns {React.ReactNode}
 */
function ResendButton({ submitting, setSubmitting }) {
  /**
   * @async
   * @function resendOtpOnClick
   */
  async function resendOtpOnClick() {
    const currentOtpState = getCurrentOtpState();

    if (!currentOtpState) {
      alertErrorApp();
      return;
    }

    /**
     * It disables submit button too.
     */
    setSubmitting(true);

    const res = await requestOtpResending(globalState.otpSwitchPending ? currentOtpState.email : undefined);

    /**
     * Enable submit button.
     */
    setSubmitting(false);

    if (!res) {
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      return;
    }

    currentOtpState.expires = getSecondsFromBase36(await res.text());

    delete currentOtpState.invalidOtpList;
    delete globalState.otpSwitchPending;
    delete currentOtpState.resendBlock;
  }

  return (
    <button type="button" onClick={resendOtpOnClick} disabled={submitting} className={styles["btn-resend"]}>
      Resend
    </button>
  );
}

/**
 * @function ResendActionText
 * @param {Object} props
 * @param {boolean} props.submitting
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setSubmitting
 * @returns {React.ReactNode}
 */
function ResendActionText({ submitting, setSubmitting }) {
  /**
   * @type {OtpState}
   */
  // @ts-expect-error: Current OTP State is defined.
  const currentOtpState = useSnapshot(getCurrentOtpState());

  return currentOtpState.resendBlock ? (
    <>
      Didn&#39;t get the code? <ResendButton submitting={submitting} setSubmitting={setSubmitting} />
    </>
  ) : (
    <>
      Code successfully resent
      <IconTick width="1em" />
    </>
  );
}

/**
 * @function ResendText
 * @param {Object} props
 * @param {boolean} props.submitting
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setSubmitting
 * @returns {React.ReactNode}
 */
function ResendText({ submitting, setSubmitting }) {
  /**
   * @type {OtpState}
   */
  // @ts-expect-error: Current OTP State is defined.
  const currentOtpState = getCurrentOtpState();

  const currentOtpStateReactive = useSnapshot(currentOtpState);
  const [resendBlockRemainingSeconds, setResendBlockRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!currentOtpStateReactive.resendBlock) {
      return;
    }

    const remainingSeconds = currentOtpStateReactive.resendBlock - Math.trunc(Date.now() / 1000);

    if (remainingSeconds <= 0) {
      return;
    }

    setResendBlockRemainingSeconds(remainingSeconds);

    /**
     * `resendBlock` (unlike `inputBlock`) must not be deleted here, since it will be used to check if the user can resend the OTP.
     */

    const interval = setInterval(() => {
      setResendBlockRemainingSeconds(prev => {
        if (prev > 1) {
          return prev - 1;
        }
        clearInterval(interval);
        return 0;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [currentOtpStateReactive.resendBlock]);

  return resendBlockRemainingSeconds ? (
    <>
      Resend OTP in <strong className={styles["seconds-resend"]}>{resendBlockRemainingSeconds.toString().padStart(2, "0")}</strong> seconds
    </>
  ) : (
    <ResendActionText submitting={submitting} setSubmitting={setSubmitting} />
  );
}

/**
 * @function FormOtp
 * @param {Object} props
 * @param {AfterVerification} props.afterVerification
 * @param {RequestOtpVerification} props.requestOtpVerification
 * @returns {React.ReactNode}
 */
function FormOtp({ afterVerification, requestOtpVerification }) {
  const hrefBack = useContext(ContextHrefBack);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const currentOtpState = getCurrentOtpState();

    if (!currentOtpState) {
      alertErrorApp();
      router.replace(hrefBack);
      return;
    }

    const timeout = setTimeout(
      () => {
        router.push(hrefBack);
        clearOldOtpStates();
        alertMessage("The OTP has expired. Please try again.");
      },
      1000 * currentOtpState.expires - Date.now()
    );

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  /**
   * @async
   * @function sendOtpToServer
   * @param {React.SubmitEvent<HTMLFormElement>} event
   */
  async function sendOtpToServer(event) {
    event.preventDefault();

    const otp = event.currentTarget.otp.value;

    if (otp?.length !== otpAttributes.length) {
      alertErrorApp();
      return;
    }

    const currentOtpState = getCurrentOtpState();

    if (!currentOtpState) {
      alertErrorApp();
      return;
    }

    setSubmitting(true);

    const res = await requestOtpVerification(otp, globalState.otpSwitchPending ? currentOtpState.email : undefined);

    if (!res) {
      clearOtpStateList();
      setSubmitting(false);
      return;
    }

    delete globalState.otpSwitchPending;

    if (!res.ok) {
      switch (res.status) {
        case 403:
          currentOtpState.blocked = false;
          currentOtpState.invalidOtpList ??= proxySet();
          currentOtpState.invalidOtpList.add(otp);
          const inputBlockCompressed = (await res.text())?.trim();
          if (inputBlockCompressed) {
            currentOtpState.inputBlock = decompressNumber(inputBlockCompressed);
            if (currentOtpState.resendBlock && currentOtpState.inputBlock > currentOtpState.resendBlock) {
              currentOtpState.resendBlock = currentOtpState.inputBlock;
            }
          }
          break;
        case 404:
          if (currentOtpState.blocked === false) {
            currentOtpState.blocked = true;
            alertMessage("You have been blocked from verifying this email address. Wait a few minutes before trying again.");
            router.push(hrefBack);
            delete currentOtpState.inputBlock;
            delete currentOtpState.invalidOtpList;
            delete currentOtpState.resendBlock;
          } else {
            alertErrorApp();
          }
      }
      setSubmitting(false);
      return;
    }

    await afterVerification(res);

    clearOtpStateList();
  }

  return (
    <form onSubmit={sendOtpToServer}>
      <FormOtpContent submitting={submitting} />
      <p className={styles["p-resend"]}>
        <ResendText submitting={submitting} setSubmitting={setSubmitting} />
      </p>
      <p className={styles["p-resend-description"]}>You can only resend once per email. Check your spam folder before resending.</p>
    </form>
  );
}

/**
 * @function UserEmailVerify
 * @param {Object} props
 * @param {AfterVerification} props.afterVerification
 * @param {RequestOtpVerification} props.requestOtpVerification
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export default function UserEmailVerify({ afterVerification, children, requestOtpVerification }) {
  const pathname = usePathname();
  const router = useRouter();

  const email = getCurrentOtpState()?.email;
  const hrefBack = pathname.substring(0, pathname.length - 7) + "#email";

  useEffect(() => {
    if (!email) {
      router.replace(hrefBack);
    }
  }, []);

  // Prevent rendering the wrapped component
  return email ? (
    <>
      {children}
      <p>
        Enter the verification code sent to:
        <LongWord as="strong" className={styles.email}>
          {email}
        </LongWord>
      </p>
      <ContextHrefBack value={hrefBack}>
        <FormOtp afterVerification={afterVerification} requestOtpVerification={requestOtpVerification} />
      </ContextHrefBack>
    </>
  ) : (
    "Redirecting..."
  );
}
