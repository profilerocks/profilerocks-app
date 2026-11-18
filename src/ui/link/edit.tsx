import IconPencil from "#src/icons/pencil.svg";
import IconArrowRight from "#src/icons/arrow/right.svg";
import LinkFix from "#src/ui/link";

export default function LinkEdit({
  children,
  className: customClassName,
  ...props
}: React.ComponentProps<typeof LinkFix>): React.ReactNode {
  return (
    <LinkFix
      className={
        "flex items-center gap-3 bg-black p-2.5 text-teal-500 transition-colors select-none hover:bg-zinc-800 hover:text-teal-400 active:bg-zinc-700 active:text-teal-300" +
        (customClassName ? " " + customClassName : "")
      }
      {...props}
    >
      <IconPencil className="min-w-max" width="1.5em" />
      <span className="truncate">{children}</span>
      <IconArrowRight className="ms-auto min-w-max" width="1.25em" />
    </LinkFix>
  );
}
