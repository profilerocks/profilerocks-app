/**
 * @function
 * @param {any} props
 * @returns {React.ReactNode}
 */
export default function LongWord({ children, className: customClassName, as: Tag = "span", ...restProps }) {
  return (
    <Tag
      className={
        "relative -mx-3 -mbe-2.5 min-h-max scrollbar-gutter-stable overflow-x-auto overflow-y-visible pbe-2.5 text-nowrap before:sticky before:inset-s-0 before:me-3 before:shadow-md before:transition-shadow after:sticky after:inset-e-0 after:ms-3 after:shadow-md after:transition-shadow" +
        (customClassName ? " " + customClassName : "")
      }
      {...restProps}
    >
      {children}
    </Tag>
  );
}
