import LinkButtonOutline from "#src/ui/link/button/outline";
import { type LinkButtonProps } from "#src/ui/link/button";
import IconArrowLeft from "#src/icons/arrow/left.svg";

export default function LinkButtonBack({ children, ...props }: LinkButtonProps): React.ReactNode {
  return (
    <LinkButtonOutline {...props}>
      <IconArrowLeft className="drop-shadow-xs drop-shadow-black" width="1.25em" />
      {children}
    </LinkButtonOutline>
  );
}
