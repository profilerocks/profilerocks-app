import IconArrowRight from "#src/icons/arrow/right.svg";
import LinkButtonSolid from "#src/ui/link/button/solid";
import type { LinkButtonProps } from "#src/ui/link/button";

export default function LinkButtonNext({ children, ...props }: LinkButtonProps): React.ReactNode {
  return (
    <LinkButtonSolid {...props}>
      {children}
      <IconArrowRight className="ms-auto drop-shadow-xs drop-shadow-black" width="1.25em" />
    </LinkButtonSolid>
  );
}
