/**
 * @function
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props
 * @returns {React.ReactNode}
 */
export default function ButtonDanger({ className: customClassName, children, ...buttonAttributes }) {
  return (
    <button className={
      "flex items-center gap-2 rounded-3xl p-2.5 text-rose-400 transition-colors select-none enabled:cursor-pointer enabled:hover:bg-zinc-300 enabled:active:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-950" +
      (customClassName ? " " + customClassName : "")
    } {...buttonAttributes}>
      {children}
    </button>
  );
}
