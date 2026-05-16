import Link from "next/link";
import IconPencil from "#src/icons/pencil.svg";
import IconArrowRight from "#src/icons/arrow/right.svg";
import ArrowRight from "#src/ui/arrow/right";
import LongWord from "#src/ui/text/long";
import styles from "./index.module.scss";

/**
 * @function
 * @param {import("next/link").LinkProps<HTMLAnchorElement>&React.HTMLProps<HTMLAnchorElement>} props
 * @returns
 */
export default function LinkEdit({ children, className, ...props }) {
  return (
    <Link {...props} className={className ? `${className} ${styles.edit}` : styles.edit}>
      <IconPencil width="1.5em" />
      <LongWord>{children}</LongWord>
      <ArrowRight />
    </Link>
  );
}
