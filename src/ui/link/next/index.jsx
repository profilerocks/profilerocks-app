import IconArrowRight from "#src/icons/arrow/right.svg";
import LinkPillSolid from "#src/ui/link/pill/solid";

/**
 * @import {LinkProps} from "next/link"
 */

/**
 * @function
 * @param {LinkProps<HTMLAnchorElement>&React.HTMLProps<HTMLAnchorElement>} props
 * @returns {React.ReactNode}
 */
export default function LinkNext({ children, ...props }) {
  return (
    <LinkPillSolid {...props}>
      {children}
      <IconArrowRight className="drop-shadow-xs drop-shadow-black ms-auto" width="1.25em" />
    </LinkPillSolid>
  );
}
