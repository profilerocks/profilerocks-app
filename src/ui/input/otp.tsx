import type React from "react";
import otpAttributes from "#shared/otp.json";
import { fontCode } from "#src/lib/fonts";
import { regexNotWordsGlobal } from "#src/lib/regex";

export interface InputOtpProps
  extends Omit<
    React.ComponentPropsWithoutRef<"input">,
    | "autoCapitalize"
    | "className"
    | "maxLength"
    | "minLength"
    | "onBeforeInput"
    | "placeholder"
    | "spellCheck"
    | "type"
  > {
  valid?: boolean;
}

const placeholder = "*".repeat(otpAttributes.length);

function otpOnBeforeInput(event: React.FormEvent<HTMLInputElement>): void {
  const data = (event.nativeEvent as InputEvent)?.data;

  if (data && data.replaceAll(regexNotWordsGlobal, "") !== data) {
    event.preventDefault();
  }
}

export default function InputOtp({ onChange, valid, ...inputAttributes }: InputOtpProps): React.ReactNode {
  const invalid = valid === false;

  return (
    <input
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      className={
        fontCode.className +
        /**
         * `bg-clip-text` fixes autofill background in Chrome.
         */
        " w-full border-be-2 border-zinc-700 bg-clip-text py-3 ps-px text-3xl tracking-widest lowercase caret-current outline-hidden transition-colors placeholder:ps-px focus:border-current " +
        (invalid ? "text-rose-400" : "text-emerald-400")
      }
      minLength={otpAttributes.length}
      maxLength={otpAttributes.length}
      name="otp"
      onBeforeInput={otpOnBeforeInput}
      onChange={onChange}
      pattern={otpAttributes.regex}
      placeholder={placeholder}
      spellCheck={false}
      title={invalid ? "Invalid OTP Code" : undefined}
      type="text"
      {...inputAttributes}
    />
  );
}
