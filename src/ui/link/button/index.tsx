import Link from "next/link";
import type { LinkProps } from "next/link";

export interface LinkButtonProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, LinkProps {
  children?: React.ReactNode;
  href: string;
  className?: string;
}

export default function LinkButton({ children, href, className: customClassName, ...restProps }: LinkButtonProps): React.ReactNode {
  const className =
    "flex min-w-max items-center gap-2.5 rounded-lg p-2.5 font-medium transition-colors select-none hover:bg-zinc-800 active:bg-zinc-700" +
    (customClassName ? " " + customClassName : "");

  if (href.startsWith("/")) {
    return (
      <Link className={className} href={href} {...restProps}>
        {children}
      </Link>
    );
  }

  return (
    <a className={className} href={href} {...restProps}>
      {children}
    </a>
  );
}
