import { useId } from "react";
import styles from "./index.module.scss";

/**
 * @typedef {Omit<
 *   { children?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>,
 *   "className" | "id"
 *   > & { ref?: React.Ref<HTMLInputElement> }
 * } Props
 */

/**
 * @param {Props} props
 */
function InputGroupWithLabel({ children, placeholder = " ", ref, ...inputAttributes }) {
  const inputId = useId();

  return (
    <div className={styles["input-group"]}>
      <input {...inputAttributes} ref={ref} placeholder={placeholder} className={styles["input-custom"]} id={inputId} />
      <label htmlFor={inputId}>{children}</label>
    </div>
  );
}

/**
 * @param {Props} props
 */
export default function InputGroup({ children, ...inputAttributes }) {
  return children ? (
    <InputGroupWithLabel {...inputAttributes}>{children}</InputGroupWithLabel>
  ) : (
    <input {...inputAttributes} className={styles["input-custom"]} />
  );
}
