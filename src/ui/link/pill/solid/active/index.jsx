import { usePathname } from "next/navigation";
import LinkPillSolid from "#src/ui/link/pill/solid";
import styles from "./index.module.scss";

/**
 * @function
 * @param {import("next/link").LinkProps<HTMLAnchorElement>&React.HTMLProps<HTMLAnchorElement>} props
 * @returns {React.ReactNode}
 */
export default function LinkPillSolidActive({ children, href, className: customClassName = "", ...props }) {
  const pathname = usePathname();

  let className = customClassName;

  if (href.split("?")[0].split("#")[0] === pathname) {
    className += " " + styles.active;
  }

  return (
    <LinkPillSolid className={className} href={href} {...props}>
      {children}
    </LinkPillSolid>
  );
}
