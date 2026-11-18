"use client";

import { usePathname } from "next/navigation";
import LinkButton, { type LinkButtonProps } from "#src/ui/link/button";

export default function LinkButtonSolidActive({ children, href, className: customClassName, ...props }: LinkButtonProps): React.ReactNode {
  const pathname = usePathname();

  const active = href.split("?")[0].split("#")[0] === pathname;

  return (
    <LinkButton
      className={
        "bg-zinc-900 " +
        (active ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-300 active:text-zinc-200") +
        (customClassName ? " " + customClassName : "")
      }
      href={href}
      {...props}
    >
      {children}
    </LinkButton>
  );
}
