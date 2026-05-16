import IconArrowLeft from "#src/icons/arrow/left.svg";
import stylesLinkPill from "#src/ui/link/pill/index.module.scss";
import stylesLinkPillOutline from "#src/ui/link/pill/outline/index.module.scss";

/**
 * `<Link />` is not used because it does not work well with #hash location like an `<a>` tag.
 *
 * @function
 * @param {Omit<import("next/link").LinkProps<HTMLAnchorElement>&React.HTMLProps<HTMLAnchorElement>,"title">} props
 * @returns {React.ReactNode}
 */
export default function LinkBackNormal({ children, className: propClassName, ...props }) {
  let className = `${stylesLinkPill.pill} ${stylesLinkPillOutline.outline}`;

  if (propClassName) {
    className += " " + propClassName;
  }

  return (
    <a {...props} className={className}>
      <IconArrowLeft width="1.25em" />
      {children}
    </a>
  );
}
