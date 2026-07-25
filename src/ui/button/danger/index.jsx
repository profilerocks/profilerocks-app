/**
 * @function
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props
 * @returns {React.ReactNode}
 */
export default function ButtonDanger({ className: customClassName, children, ...buttonAttributes }) {
  return (
    <button
      className={
        "flex items-center gap-2 rounded-3xl bg-rose-950 p-2.5 text-rose-400 transition-colors select-none enabled:cursor-pointer enabled:hover:bg-rose-900 enabled:hover:text-rose-300 enabled:active:bg-rose-800 enabled:active:text-rose-200 disabled:cursor-not-allowed disabled:text-rose-800" +
        (customClassName ? " " + customClassName : "")
      }
      {...buttonAttributes}
    >
      {children}
    </button>
  );
}
