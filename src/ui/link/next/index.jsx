import ArrowRight from "#src/ui/arrow/right";
import LinkPillSolid from "#src/ui/link/pill/solid";

/**
 * @function
 * @param {import("next/link").LinkProps<HTMLAnchorElement>&React.HTMLProps<HTMLAnchorElement>} props
 * @returns {React.ReactNode}
 */
export default function LinkNext({ children, ...props }) {
  return (
    <LinkPillSolid {...props}>
      {children}
      <ArrowRight />
    </LinkPillSolid>
  );
}
