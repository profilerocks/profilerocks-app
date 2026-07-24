import Link from "next/link";
import IconPencil from "#src/icons/pencil.svg";
import IconArrowRight from "#src/icons/arrow/right.svg";
import LongWord from "#src/ui/text/long";
import styles from "./index.module.scss";

/**
 * @import {LinkProps} from "next/link"
 */

/**
 * @function
 * @param {LinkProps<HTMLAnchorElement>&React.HTMLProps<HTMLAnchorElement>} props
 * @returns
 */
export default function LinkEdit({ children, className, ...props }) {
  return (
    <Link {...props} className={className ? `${className} ${styles.edit}` : styles.edit}>
      <IconPencil width="1.5em" />
      <LongWord>{children}</LongWord>
      <IconArrowRight className="ms-auto" width="1.25em" />
    </Link>
  );
}
