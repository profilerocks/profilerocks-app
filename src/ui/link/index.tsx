import Link from "next/link";

export default function LinkFix({ children, href, ...restProps }: React.ComponentProps<typeof Link>): React.ReactNode {
  href = href.toString();

  const El = href.startsWith("/") ? Link : "a";

  return (
    <El href={href} {...restProps}>
      {children}
    </El>
  );
}
