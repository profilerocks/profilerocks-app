"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import LinkPill, { type LinkPillProps } from "#src/ui/link/pill";

export default function LinkPillSolidActive({
  children,
  href,
  className: customClassName,
  ...props
}: LinkPillProps): React.ReactNode {
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
