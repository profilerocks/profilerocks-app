"use client";

import { usePathname } from "next/navigation";
import LinkButton from "#src/ui/link/button";

export default function LinkButtonSolidActive({
  children,
  className: customClassName,
  ...restProps
}: React.ComponentProps<typeof LinkButton>): React.ReactNode {
  const pathname = usePathname();

  const active = restProps.href.toString().split("?")[0].split("#")[0] === pathname;

  return (
    <LinkButton
      className={
        "bg-zinc-900 " +
        (active ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-300 active:text-zinc-200") +
        (customClassName ? " " + customClassName : "")
      }
      {...restProps}
    >
      {children}
    </LinkButton>
  );
}
