import LinkButton, { type LinkButtonProps } from "#src/ui/link/button";

export default function LinkButtonSolid({ children, className: customClassName, ...props }: LinkButtonProps): React.ReactNode {
  return (
    <LinkButton
      className={"bg-zinc-900 text-zinc-400 hover:text-zinc-300 active:text-zinc-200" + (customClassName ? " " + customClassName : "")}
      {...props}
    >
      {children}
    </LinkButton>
  );
}
