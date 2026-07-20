import { fontCode } from "#src/lib/fonts";
import otpAttributes from "#shared/otp.json";

/**
 * @import {Props} from "./types"
 */

const placeholder = "*".repeat(otpAttributes.length);
const regexNotWordsGlobal = /\W/g;

/**
 * @function otpOnBeforeInput
 * @param {React.InputEvent} event
 */
function otpOnBeforeInput(event) {
  const data = event.data;

  if (data?.replaceAll(regexNotWordsGlobal, "") !== data) {
    event.preventDefault();
  }
}

/**
 * @function
 * @param {Props} props
 */
export default function InputOtp({ onChange, valid, ...inputAttributes }) {
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
        " w-full border-be-2 border-zinc-700 bg-clip-text py-3 ps-px text-3xl tracking-widest lowercase caret-current transition-colors outline-none placeholder:ps-px focus:border-current " +
        (invalid ? "text-rose-500" : "text-emerald-400")
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
