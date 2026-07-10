/**
 * @function
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props
 * @returns {React.ReactNode}
 */
export default function Button({ className: customClassName, children, ...buttonAttributes }) {
  return (
    <button
      className={"flex items-center gap-2.5 transition-color text-black enabled:bg-zinc-400 p-2.5 br-4 rounded-3xl disabled:bg-zinc-500 disabled:cursor-not-allowed" + (customClassName ? " " + customClassName : "")}
      {...buttonAttributes}
    >
      {children}
    </button>
  );
}
