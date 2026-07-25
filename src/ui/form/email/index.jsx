"use client";

import { isValid as isEmailValid } from "mailchecker";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import normalizeEmail from "validator/es/lib/normalizeEmail";
import { showAlertErrorApp, showAlert } from "#src/lib/alert";
import globalState from "#src/lib/state";
import { getOtpState, switchOtpState } from "#src/lib/state/otp";
import { getSecondsFromBase36 } from "#src/lib/time";
import IconBlock from "#src/icons/block.svg";
import IconEmail from "#src/icons/email.svg";
import InputGroup from "#src/ui/input/group";
import ButtonNext from "#src/ui/button/next";
import LinkBack from "#src/ui/link/back";
import otpAttributes from "#shared/otp.json";

/**
 * @import {OtpState} from "#src/lib/state/otp"
 */

/**
 * @async
 * @callback RequestOtpCreation
 * @param {string} email
 * @returns {Promise<Response|undefined>}
 */

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {RequestOtpCreation} props.requestOtpCreation
 * @param {string} [props.hrefBack]
 * @returns {React.ReactNode}
 */
export default function FormUserEmail({ children, hrefBack, requestOtpCreation }) {
  const [email, setEmail] = useState(globalState.email ?? "");

  const [emailBlock, setEmailBlock] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const emailFormatValidity = email && globalState.email !== email ? isEmailValid(email) : undefined;

  /**
   * @type {React.RefObject<OtpState|null>}
   */
  const otpStateRef = useRef(null);

  const pathname = usePathname();

  const router = useRouter();

  /**
   * @function setEmailOnInput
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  function setEmailOnInput(event) {
    const el = event.currentTarget;
    setEmail(el.validity.valid ? el.value : "");
  }

  useEffect(() => {
    if (!emailFormatValidity) {
      setEmailBlock(false);
      return;
    }

    otpStateRef.current = getOtpState(email) ?? null;

    setEmailBlock(otpStateRef.current?.blocked ?? false);
  }, [email]);

  useEffect(() => {
    if (!emailBlock) {
      return;
    }

    if (!otpStateRef.current) {
      setEmailBlock(false);
      return;
    }

    const timeout = setTimeout(
      () => {
        setEmailBlock(false);
      },
      1000 * otpStateRef.current.expires - Date.now()
    );

    return () => {
      clearTimeout(timeout);
      setEmailBlock(false);
    };
  }, [emailBlock]);

  /**
   * @async
   * @function sendEmailToServer
   * @param {React.SubmitEvent<HTMLFormElement>} event
   */
  async function sendEmailToServer(event) {
    event.preventDefault();

    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      showAlertErrorApp();
      return;
    }

    if (switchOtpState(normalizedEmail)) {
      router.push(pathname + "/verify");
      return;
    }

    if ((globalState.otp?.length ?? 0) >= otpAttributes.maxCredentials) {
      showAlert("You have reached the maximum number of email addresses you can verify.");
      return;
    }

    setSubmitting(true);

    const res = await requestOtpCreation(normalizedEmail);

    if (!res) {
      setSubmitting(false);
      return;
    }

    if (!res.ok) {
      showAlert("Please try again or use another email address. Contact support if you believe this is an error.");
      setSubmitting(false);
      return;
    }

    const text = await res.text();

    if (!text) {
      showAlertErrorApp();
      setSubmitting(false);
      return;
    }

    if (text.endsWith("!")) {
      otpStateRef.current = {
        email: normalizedEmail,
        expires: getSecondsFromBase36(text.substring(0, text.length - 1)),
        blocked: true
      };
      setEmailBlock(true);
      setSubmitting(false);
    } else {
      const [expiresSecondsBase36, resendBlockSecondsBase36] = text.split(",");

      otpStateRef.current = {
        email: normalizedEmail,
        expires: getSecondsFromBase36(expiresSecondsBase36),
        resendBlock: getSecondsFromBase36(resendBlockSecondsBase36)
      };

      router.push(pathname + "/verify");
    }

    if (globalState.otp) {
      globalState.otp.push(otpStateRef.current);
    } else {
      globalState.otp = [otpStateRef.current];
    }
  }

  return (
    <form onSubmit={sendEmailToServer}>
      <InputGroup
        autoComplete="email"
        defaultValue={email}
        disabled={submitting}
        maxLength={254}
        minLength={3}
        name="email"
        onChange={setEmailOnInput}
        placeholder="e.g. someone@example.com"
        required
        size={25}
        type="email"
      >
        <IconEmail width="1.125em" />
        Email
      </InputGroup>
      {children}
      <div className="flex justify-between mbs-5">
        {hrefBack && <LinkBack href={hrefBack}>Back</LinkBack>}
        <ButtonNext
          disabled={submitting || !emailFormatValidity || emailBlock}
          title={emailFormatValidity ? (submitting ? "Submitting..." : undefined) : "Enter a valid email address"}
          type="submit"
        >
          {emailBlock ? (
            <>
              <IconBlock width="1.25em" />
              Email blocked
            </>
          ) : (
            "Next"
          )}
        </ButtonNext>
      </div>
    </form>
  );
}
