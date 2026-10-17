import { usePathname } from "next/navigation";
import LinkPill from "#src/ui/link/pill";

/**
 * @function
 * @param {import("next/link").LinkProps<HTMLAnchorElement>&React.HTMLProps<HTMLAnchorElement>} props
 * @returns {React.ReactNode}
 */
export default function LinkPillSolidActive({ children, href, className: customClassName, ...props }) {
  const pathname = usePathname();

  const active = href.split("?")[0].split("#")[0] === pathname;

  return (
    <LinkPill
      className={
        "bg-zinc-900 " +
        (active ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-300 active:text-zinc-200") +
        (customClassName ? " " + customClassName : "")
      }
      href={href}
      {...props}
    >
      {children}
    </LinkPill>
  );
}
