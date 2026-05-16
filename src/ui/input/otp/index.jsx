import { fontCode } from "#src/lib/fonts";
import otpAttributes from "#shared/otp.json";

import styles from "./index.module.scss";

/**
 * @import { Props } from "./types"
 */

const defaultClassName = `${fontCode.className} ${styles["input-otp"]}`;
const placeholder = "*".repeat(otpAttributes.length);
const regexNotWordsGlobal = /\W/g;

/**
 * @function otpOnBeforeInput
 * @param {React.FormEvent<HTMLInputElement>} event
 */
function otpOnBeforeInput(event) {
  // @ts-expect-error
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
  let className = defaultClassName;

  if (valid === false) {
    className += " " + styles["invalid"];
  }

  return (
    <input
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      type="text"
      name="otp"
      placeholder={placeholder}
      minLength={otpAttributes.length}
      maxLength={otpAttributes.length}
      spellCheck={false}
      pattern={otpAttributes.regex}
      onBeforeInput={otpOnBeforeInput}
      onChange={onChange}
      className={className}
      {...inputAttributes}
    />
  );
}
