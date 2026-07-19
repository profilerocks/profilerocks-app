/**
 * @import {LinkProps} from "next/link"
 */

/**
 * @function
 * @param {LinkProps<HTMLAnchorElement>&React.HTMLProps<HTMLAnchorElement>} props
 * @returns {React.ReactNode}
 */
export default function LinkPill({ children, className: customClassName, ...props }) {
  return (
    <a
      className={
        "flex items-center gap-2.5 rounded-3xl p-2.5 font-medium transition-colors select-none hover:bg-zinc-800 active:bg-zinc-700" +
        (customClassName ? " " + customClassName : "")
      }
      {...props}
    >
      {children}
    </a>
  );
}
