import Link from "next/link";

/**
 * @import {LinkProps} from "next/link"
 */

/**
 * @function
 * @param {LinkProps<HTMLAnchorElement>&React.HTMLProps<HTMLAnchorElement>} restProps
 * @returns {React.ReactNode}
 */
export default function LinkPill({ children, href, className: customClassName, ...restProps }) {
  const Tag = href.startsWith("/") ? Link : "a";

  return (
    <Tag
      className={
        "flex min-w-max items-center gap-2.5 rounded-3xl p-2.5 font-medium transition-colors select-none hover:bg-zinc-800 active:bg-zinc-700" +
        (customClassName ? " " + customClassName : "")
      }
      href={href}
      {...restProps}
    >
      {children}
    </Tag>
  );
}
