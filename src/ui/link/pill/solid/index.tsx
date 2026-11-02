import type React from "react";
import LinkPill, { type LinkPillProps } from "#src/ui/link/pill";

export default function LinkPillSolid({
  children,
  className: customClassName,
  ...props
}: LinkPillProps): React.ReactNode {
  return (
    <LinkPill
      className={"bg-zinc-900 text-zinc-400 hover:text-zinc-300 active:text-zinc-200" + (customClassName ? " " + customClassName : "")}
      {...props}
    >
      {children}
    </LinkPill>
  );
}
