"use client";

import type React from "react";
import { useId } from "react";

export interface InputCheckboxProps extends Omit<React.ComponentPropsWithoutRef<"input">, "id" | "type"> {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
}

export default function InputCheckbox({
  children,
  className: customClassName,
  ref,
  title,
  ...inputAttributes
}: InputCheckboxProps): React.ReactNode {
  const inputId = useId();

  return (
    <div
      className={
        "flex max-w-max items-center rounded-sm ps-2 text-zinc-400 transition-colors has-enabled:text-zinc-300 has-enabled:hover:bg-zinc-800 has-enabled:active:bg-zinc-700" +
        (customClassName ? " " + customClassName : "")
      }
      title={title}
    >
      <input
        className="peer scale-125 accent-emerald-400 enabled:cursor-pointer disabled:cursor-not-allowed"
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
