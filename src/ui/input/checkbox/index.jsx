"use client";

import { useId } from "react";
import styles from "./index.module.scss";

/**
 * @function
 * @param {Omit<
 *   React.InputHTMLAttributes<HTMLInputElement>,
 *   "id"|"type"
 * > & { children?: React.ReactNode; ref?: React.Ref<HTMLInputElement> }} props
 * @returns {React.ReactNode}
 */
export default function InputCheckbox({ children, className, placeholder = " ", ref, title, ...inputAttributes }) {
  const inputId = useId();

  let classNameInputCheckboxContainer = styles["container-input-checkbox"];

  if (className) {
    classNameInputCheckboxContainer += " " + className;
  }

  return (
    <div className={classNameInputCheckboxContainer} title={title}>
      <input {...inputAttributes} className={styles.checkbox} id={inputId} ref={ref} type="checkbox" />
      <label className={styles["label-checkbox"]} htmlFor={inputId}>
        {children}
      </label>
    </div>
  );
}
