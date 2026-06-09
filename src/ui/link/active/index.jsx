import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./index.module.scss";

/**
 * @function
 * @param {import("next/link").LinkProps<HTMLAnchorElement>&React.HTMLProps<HTMLAnchorElement>} param
 * @returns {React.ReactNode}
 */
export default function LinkActive({ children, href, className: customClassName = "", ...restAttributes }) {
  const pathname = usePathname();

  let active = href.split("?")[0].split("#")[0] === pathname;
  let className = customClassName;

  if (active) {
    if (className) {
      className += " " + styles.active;
    } else {
      className = styles.active;
    }
  }

  return (
    <Link href={href} className={className} {...restAttributes} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}
