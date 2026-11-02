"use client";

import type React from "react";
import { isValid as isEmailValid } from "mailchecker";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import normalizeEmail from "validator/es/lib/normalizeEmail";
import { showAlertErrorApp, showAlert } from "#src/lib/alert";
import globalState from "#src/lib/state";
import { getCurrentOtpState, getOtpState, switchOtpState, type OtpState } from "#src/lib/state/otp";
import { getSecondsFromBase36 } from "#src/lib/time";
import IconArrowRight from "#src/icons/arrow/right.svg";
import IconBlock from "#src/icons/block.svg";
import IconEmail from "#src/icons/email.svg";
import { requestOtpUpdateCreation } from "#src/lib/request";
import InputGroup from "#src/ui/input/group";
import Button from "#src/ui/button";
import LinkBack from "#src/ui/link/back";
import otpAttributes from "#shared/otp.json";

export type RequestOtpCreation = (email: string) => Promise<Response | undefined>;

export interface FormUserEmailProps {
  children?: React.ReactNode;
  hrefBack?: string;
}

export default function FormUserEmail({ children, hrefBack }: FormUserEmailProps): React.ReactNode {
  const [email, setEmail] = useState(getCurrentOtpState()?.email ?? globalState.email ?? "");
  const [emailBlock, setEmailBlock] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emailFormatValidity = email && globalState.email !== email ? isEmailValid(email) : undefined;
  const otpStateRef = useRef<OtpState | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  function setEmailOnInput(event: React.ChangeEvent<HTMLInputElement>): void {
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
  }, [email, emailFormatValidity]);

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

  async function sendEmailToServer(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const normalizedEmail = normalizeEmail(email) as string | false;

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

    const res = await requestOtpUpdateCreation(normalizedEmail);

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
      <div className="mbs-5 flex justify-between">
        {hrefBack && (
          <LinkBack className="pe-3.5" href={hrefBack}>
            Back
          </LinkBack>
        )}
        <Button
          className={emailBlock ? "pe-3.5" : "ps-3.5"}
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
            <>
              Next
              <IconArrowRight width="1.25em" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
