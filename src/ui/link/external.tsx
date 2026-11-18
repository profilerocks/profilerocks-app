export default function LinkExternal({
  children,
  className: customClassName,
  ...restProps
}: React.ComponentPropsWithoutRef<"a">): React.ReactNode {
  return (
    <a
      {...restProps}
      className={
        "whitespace-nowrap text-teal-500 underline decoration-transparent underline-offset-5 transition-all hover:text-teal-400 hover:decoration-current hover:underline-offset-2 active:text-teal-300" +
        (customClassName ? " " + customClassName : "")
      }
    >
      {children}
    </a>
  );
}
