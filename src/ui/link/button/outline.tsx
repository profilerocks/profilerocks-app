import LinkButton, { type LinkButtonProps } from "#src/ui/link/button";

export default function LinkButtonOutline({ children, className: customClassName, ...props }: LinkButtonProps): React.ReactNode {
  return (
    <LinkButton
      className={"text-teal-500 hover:text-teal-400 active:text-teal-300" + (customClassName ? " " + customClassName : "")}
      {...props}
    >
      {children}
    </LinkButton>
  );
}
