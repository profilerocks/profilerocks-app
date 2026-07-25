import LinkPill from "#src/ui/link/pill";

/**
 * @import {LinkProps} from "next/link"
 */

/**
 * @function
 * @param {LinkProps<HTMLAnchorElement>&React.HTMLProps<HTMLAnchorElement>} props
 * @returns {React.ReactNode}
 */
export default function LinkPillSolid({ children, className: customClassName, ...props }) {
  return (
    <LinkPill
      className={"bg-zinc-900 text-zinc-400 hover:text-zinc-300 active:text-zinc-200" + (customClassName ? " " + customClassName : "")}
      {...props}
    >
      {children}
    </LinkPill>
  );
}
