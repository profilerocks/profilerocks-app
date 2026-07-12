/**
 * @function
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props
 * @returns {React.ReactNode}
 */
export default function Button({ className: customClassName, children, ...buttonAttributes }) {
  return (
    <button
      className={
        "transition-color br-4 flex items-center gap-2.5 rounded-3xl p-2.5 text-black enabled:bg-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-500" +
        (customClassName ? " " + customClassName : "")
      }
      {...buttonAttributes}
    >
      {children}
    </button>
  );
}
