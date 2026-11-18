import LinkFix from "#src/ui/link";

export default function LinkButton({
  children,
  className: customClassName,
  ...restProps
}: React.ComponentProps<typeof LinkFix>): React.ReactNode {
  return (
    <LinkFix
      className={
        "flex min-w-max items-center gap-2.5 rounded-lg p-2.5 font-medium transition-colors select-none hover:bg-zinc-800 active:bg-zinc-700" +
        (customClassName ? " " + customClassName : "")
      }
      {...restProps}
    >
      {children}
    </LinkFix>
  );
}
