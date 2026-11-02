import type React from "react";
import Link, { type LinkProps } from "next/link";

export type LinkPillProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & {
    children?: React.ReactNode;
    href: string;
    className?: string;
  };

export default function LinkPill({ children, href, className: customClassName, ...restProps }: LinkPillProps): React.ReactNode {
  const className =
    "flex min-w-max items-center gap-2.5 rounded-3xl p-2.5 font-medium transition-colors select-none hover:bg-zinc-800 active:bg-zinc-700" +
    (customClassName ? " " + customClassName : "");

  if (href.startsWith("/")) {
    return (
      <Link className={className} href={href} {...restProps}>
        {children}
      </Link>
    );
  }

  return (
    <a className={className} href={href} {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
      {children}
    </a>
  );
}
