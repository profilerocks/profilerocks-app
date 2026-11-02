import type React from "react";
import IconArrowRight from "#src/icons/arrow/right.svg";
import LinkPillSolid from "#src/ui/link/pill/solid";
import { type LinkPillProps } from "#src/ui/link/pill";

export default function LinkNext({ children, ...props }: LinkPillProps): React.ReactNode {
  return (
    <LinkPillSolid {...props}>
      {children}
      <IconArrowRight className="ms-auto drop-shadow-xs drop-shadow-black" width="1.25em" />
    </LinkPillSolid>
  );
}
