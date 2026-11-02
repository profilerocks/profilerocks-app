import type React from "react";

export type LinkProps = React.ComponentPropsWithoutRef<"a">;

export default function Link({ children, className: customClassName, ...restProps }: LinkProps): React.ReactNode {
  return (
    <a
      {...restProps}
      className={
        "whitespace-nowrap text-teal-500 underline decoration-transparent underline-offset-5 transition-all hover:text-teal-400 hover:decoration-current hover:underline-offset-2 active:text-teal-300" +
        (customClassName ? " " + customClassName : "")
      }
    >
      {children}
    </a>
  );
}
