/**
 * @function
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props
 * @returns {React.ReactNode}
 */
export default function Button({ className: customClassName, children, ...buttonAttributes }) {
  return (
    <button
      className={
        "flex items-center gap-2.5 rounded-3xl bg-zinc-400 p-2.5 text-black transition-colors select-none enabled:cursor-pointer enabled:hover:bg-zinc-300 enabled:active:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-950" +
        (customClassName ? " " + customClassName : "")
      }
      {...buttonAttributes}
    >
      {children}
    </button>
  );
}
