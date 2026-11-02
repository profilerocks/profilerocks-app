import type React from "react";
import LinkPill, { type LinkPillProps } from "#src/ui/link/pill";

export default function LinkPillOutline({
  children,
  className: customClassName,
  ...props
}: LinkPillProps): React.ReactNode {
  return (
    <LinkPill
      className={"text-teal-500 hover:text-teal-400 active:text-teal-300" + (customClassName ? " " + customClassName : "")}
      {...props}
    >
      {children}
    </LinkPill>
  );
}
