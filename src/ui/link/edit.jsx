import Link from "next/link";
import IconPencil from "#src/icons/pencil.svg";
import IconArrowRight from "#src/icons/arrow/right.svg";

/**
 * @import {LinkProps} from "next/link"
 */

/**
 * @function
 * @param {LinkProps<HTMLAnchorElement>&React.HTMLProps<HTMLAnchorElement>} props
 * @returns {React.ReactNode}
 */
export default function LinkEdit({ children, className: customClassName, ...props }) {
  return (
    <Link
      {...props}
      className={
        "flex items-center gap-3 bg-black p-2.5 text-teal-500 transition-colors select-none hover:bg-zinc-800 hover:text-teal-400 active:bg-zinc-700 active:text-teal-300" +
        (customClassName ? " " + customClassName : "")
      }
    >
      <IconPencil className="min-w-max" width="1.5em" />
      <span className="truncate">{children}</span>
      <IconArrowRight className="ms-auto min-w-max" width="1.25em" />
    </Link>
  );
}
