import LinkPill from "#src/ui/link/pill";
import styles from "./index.module.scss";

/**
 * @function
 * @param {import("next/link").LinkProps<HTMLAnchorElement>&React.HTMLProps<HTMLAnchorElement>} props
 * @returns {React.ReactNode}
 */
export default function LinkPillOutline({ children, className: customClassName, ...props }) {
  let className = styles.outline;

  if (customClassName) {
    className += " " + customClassName;
  }

  return (
    <LinkPill className={className} {...props}>
      {children}
    </LinkPill>
  );
}
