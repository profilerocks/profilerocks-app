import LinkPillOutline from "#src/ui/link/pill/outline";
import IconArrowLeft from "#src/icons/arrow/left.svg";

/**
 * @import {LinkProps} from "next/link"
 */

/**
 * @function
 * @param {LinkProps<HTMLAnchorElement>&React.HTMLProps<HTMLAnchorElement>} props
 * @returns {React.ReactNode}
 */
export default function LinkBack({ children, ...props }) {
  return (
    <LinkPillOutline {...props}>
      <IconArrowLeft className="drop-shadow-xs drop-shadow-black" width="1.25em" />
      {children}
    </LinkPillOutline>
  );
}
