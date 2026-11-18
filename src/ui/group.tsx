interface GroupProps {
  as: React.ElementType;
  children: React.ReactNode;
}

export default function Group({ as: As = "div", children }: GroupProps) {
  return <As className="flex flex-wrap gap-x-6 *:flex-1 *:basis-3xs">{children}</As>;
}
