import IconArrowRight from "#src/icons/arrow/right.svg";
import stylesLinkPill from "#src/ui/link/pill/index.module.scss";
import stylesLinkPillSolid from "#src/ui/link/pill/solid/index.module.scss";

/**
 * `<Link />` is not used because it does not work well with #hash location like an `<a>` tag.
 *
 * @function
 * @param {Omit<import("next/link").LinkProps<HTMLAnchorElement>&React.HTMLProps<HTMLAnchorElement>,"title">} props
 * @returns {React.ReactNode}
 */
export default function LinkNextNormal({ children, className: propClassName, ...props }) {
  let className = `${stylesLinkPill.pill} ${stylesLinkPillSolid.solid}`;

  if (propClassName) {
    className += " " + propClassName;
  }

  return (
    <a {...props} className={className}>
      {children}
      <IconArrowRight width="1.25em" />
    </a>
  );
}
