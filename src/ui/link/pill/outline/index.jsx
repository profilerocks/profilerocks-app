import LinkPill from "#src/ui/link/pill";

/**
 * @function
 * @param {import("next/link").LinkProps<HTMLAnchorElement>&React.HTMLProps<HTMLAnchorElement>} props
 * @returns {React.ReactNode}
 */
export default function LinkPillOutline({ children, className: customClassName, ...props }) {
  return (
    <LinkPill
      className={"text-teal-500 hover:text-teal-400 active:text-teal-300" + (customClassName ? " " + customClassName : "")}
      {...props}
    >
      {children}
    </LinkPill>
  );
}
