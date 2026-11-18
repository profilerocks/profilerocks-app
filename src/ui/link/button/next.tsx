import IconArrowRight from "#src/icons/arrow/right.svg";
import LinkButtonSolid from "#src/ui/link/button/solid";

export default function LinkButtonNext({ children, ...props }: React.ComponentProps<typeof LinkButtonSolid>): React.ReactNode {
  return (
    <LinkButtonSolid {...props}>
      {children}
      <IconArrowRight className="ms-auto drop-shadow-xs drop-shadow-black" width="1.25em" />
    </LinkButtonSolid>
  );
}
