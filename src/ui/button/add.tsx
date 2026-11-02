import type React from "react";
import IconPlus from "#src/icons/plus.svg";
import Button, { type ButtonProps } from "#src/ui/button";

export default function ButtonAdd({ children, ...props }: ButtonProps): React.ReactNode {
  return (
    <Button {...props}>
      <IconPlus width="1.25em" />
      {children}
    </Button>
  );
}
