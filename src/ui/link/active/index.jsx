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

  let className = customClassName;

  if (href.split("?")[0].split("#")[0] === pathname) {
    className += " " + styles.active;
  }

  return (
    <Link href={href} className={className} {...restAttributes}>
      {children}
    </Link>
  );
}
