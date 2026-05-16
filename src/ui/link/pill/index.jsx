import Link from "next/link";
import styles from "./index.module.scss";

/**
 * @function
 * @param {import("next/link").LinkProps<HTMLAnchorElement>&React.HTMLProps<HTMLAnchorElement>} props
 * @returns {React.ReactNode}
 */
export default function LinkPill({ children, className: customClassName, ...props }) {
  let className = styles.pill;

  if (customClassName) {
    className += " " + customClassName;
  }

  return (
    <Link className={className} {...props}>
      {children}
    </Link>
  );
}
