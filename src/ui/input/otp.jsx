import otpAttributes from "#shared/otp.json";
import { fontCode } from "#src/lib/fonts";
import { regexNotWordsGlobal } from "#src/lib/regex";

/**
 * @typedef {Object} Props
 * @prop {boolean} [valid]
 */

const placeholder = "*".repeat(otpAttributes.length);

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
 * @param {Exclude<React.InputHTMLAttributes<HTMLInputElement>,"autoCapitalize"|"className"|"maxLength"|"minLength"|"name"|"onBeforeInput"|"placeholder"|"spellCheck"|"type">&Props} props
 */
export default function InputOtp({ onChange, valid, ...inputAttributes }) {
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
        (valid ? "text-emerald-400" : "text-rose-400")
      }
      minLength={otpAttributes.length}
      maxLength={otpAttributes.length}
      name="otp"
      onBeforeInput={otpOnBeforeInput}
      onChange={onChange}
      pattern={otpAttributes.regex}
      placeholder={placeholder}
      spellCheck={false}
      title={valid ? undefined : "Invalid OTP Code"}
      type="text"
      {...inputAttributes}
    />
  );
}
