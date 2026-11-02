import type React from "react";
import LinkPillOutline from "#src/ui/link/pill/outline";
import { type LinkPillProps } from "#src/ui/link/pill";
import IconArrowLeft from "#src/icons/arrow/left.svg";

export default function LinkBack({ children, ...props }: LinkPillProps): React.ReactNode {
  return (
    <LinkPillOutline {...props}>
      <IconArrowLeft className="drop-shadow-xs drop-shadow-black" width="1.25em" />
      {children}
    </LinkPillOutline>
  );
}
