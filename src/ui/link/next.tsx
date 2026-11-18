import IconArrowRight from "#src/icons/arrow/right.svg";

export default function AnchorNext({ children, ...props }: React.ComponentPropsWithoutRef<"a">): React.ReactNode {
  return (
    <a {...props}>
      {children}
      <IconArrowRight className="ms-auto drop-shadow-xs drop-shadow-black" width="1.25em" />
    </a>
  );
}
