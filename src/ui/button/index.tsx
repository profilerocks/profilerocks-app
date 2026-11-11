import type React from "react";

export type ButtonProps = React.ComponentPropsWithoutRef<"button">;

export default function Button({ className: customClassName, children, ...buttonAttributes }: ButtonProps): React.ReactNode {
  return (
    <button
      className={
        "flex items-center gap-2 rounded-lg bg-zinc-400 p-2.5 font-medium text-black transition-colors select-none enabled:cursor-pointer enabled:hover:bg-zinc-300 enabled:active:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-950" +
        (customClassName ? " " + customClassName : "")
      }
      {...buttonAttributes}
    >
      {children}
    </button>
  );
}
