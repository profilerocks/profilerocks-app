import LinkButton from "#src/ui/link/button";

export default function LinkButtonOutline({
  children,
  className: customClassName,
  ...props
}: React.ComponentProps<typeof LinkButton>): React.ReactNode {
  return (
    <LinkButton
      className={"text-teal-500 hover:text-teal-400 active:text-teal-300" + (customClassName ? " " + customClassName : "")}
      {...props}
    >
      {children}
    </LinkButton>
  );
}
