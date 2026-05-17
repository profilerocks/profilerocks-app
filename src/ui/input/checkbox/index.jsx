"use client";

import { useId } from "react";
import styles from "./index.module.scss";

/**
 * @function
 * @param {Omit<
 *   React.InputHTMLAttributes<HTMLInputElement>,
 *   "className"|"id"|"type"
 * > & { children?: React.ReactNode; ref?: React.Ref<HTMLInputElement> }} props
 * @returns {React.ReactNode}
 */
export default function InputCheckbox({ children, placeholder = " ", ref, title, ...inputAttributes }) {
  const inputId = useId();

  return (
    <div className={styles["container-input-checkbox"]} title={title}>
      <input
        {...inputAttributes}
        className={styles.checkbox}
        id={inputId}
        ref={ref}
        type="checkbox"
      />
      <label className={styles["label-checkbox"]} htmlFor={inputId}>{children}</label>
    </div>
  );
}