import type React from "react";
import IconArrowRight from "#src/icons/arrow/right.svg";
import Button, { type ButtonProps } from "#src/ui/button";

export default function ButtonNext({ children = "Next", ...buttonAttributes }: ButtonProps): React.ReactNode {
  return (
    <Button {...buttonAttributes}>
      {children}
      <IconArrowRight className="ms-auto" width="1.25em" />
    </Button>
  );
}
