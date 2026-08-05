"use client";

import { useId } from "react";

/**
 * @typedef {Object} Props
 * @prop {React.ReactNode} [children]
 * @prop {React.Ref<HTMLInputElement>} [ref]
 */

/**
 * @function
 * @param {Omit<React.InputHTMLAttributes<HTMLInputElement>,"id"|"type">&Props} props
 * @returns {React.ReactNode}
 */
export default function InputCheckbox({ children, className: customClassName, placeholder = " ", ref, title, ...inputAttributes }) {
  const inputId = useId();


  return (
    <div
      className={
        "flex items-center transition-colors rounded-sm ps-2 max-w-max text-zinc-400 has-enabled:text-zinc-300 has-enabled:hover:bg-zinc-800 has-enabled:active:bg-zinc-700" +
        (customClassName ? " " + customClassName : "")
      }
      title={title}
    >
      <input
        className="scale-125 accent-emerald-400 enabled:cursor-pointer disabled:cursor-not-allowed peer"
        id={inputId}
        ref={ref}
        type="checkbox"
        {...inputAttributes}
      />
      <label className="p-1.5 ps-2.5 select-none peer-disabled:cursor-not-allowed" htmlFor={inputId}>
        {children}
      </label>
    </div>
  );
}
