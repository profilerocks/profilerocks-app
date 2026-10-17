import LinkPillOutline from "#src/ui/link/pill/outline";
import IconArrowLeft from "#src/icons/arrow/left.svg";

/**
 * @function
 * @param {import("next/link").LinkProps<HTMLAnchorElement>&React.HTMLProps<HTMLAnchorElement>} props
 * @returns {React.ReactNode}
 */
export default function LinkBack({ children, ...props }) {
  return (
    <LinkPillOutline {...props}>
      <IconArrowLeft width="1.25em" />
      {children}
    </LinkPillOutline>
  );
}
