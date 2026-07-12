import { useId } from "react";

/**
 * @typedef {(
 *   React.InputHTMLAttributes<HTMLInputElement>&{children?:React.ReactNode}&{ref?:React.Ref<HTMLInputElement>}
 * )} Props
 */

/**
 * @function Input
 * @param {Omit<Props,"children">} props
 * @returns {React.ReactNode}
 */
function Input({ className: customClassName, ...restProps }) {
  return (
    <input
      {...restProps}
      className={
        "w-full rounded-lg border-2 border-zinc-700 bg-clip-text p-3 caret-emerald-400 transition-colors outline-none focus:border-emerald-400 user-invalid:border-rose-500" +
        (customClassName ? " " + customClassName : "")
      }
    />
  );
}

/**
 * @function InputGroupWithLabel
 * @param {Props} props
 * @returns {React.ReactNode}
 */
function InputGroupWithLabel({ children, placeholder = " ", ref, ...restProps }) {
  const inputId = useId();

  return (
    <div className="relative transition-colors pbs-2.5 select-none">
      {/* `background-clip: text` fixes autofill background in Chrome */}
      <Input
        {...restProps}
        className="peer placeholder:transition-colors placeholder:text-transparent focus:placeholder:text-zinc-400"
        id={inputId}
        placeholder={placeholder}
        ref={ref}
      />
      <label
        className="flex absolute gap-1.5 cursor-text transition-all text-sm text-zinc-300 bg-black inset-bs-0 inset-s-3 px-1.5 peer-user-invalid:text-rose-500 peer-focus:text-emerald-400 peer-not-focus:peer-placeholder-shown:inset-bs-6 peer-not-focus:peer-placeholder-shown:inset-s-2 peer-not-focus:peer-placeholder-shown:text-base"
        htmlFor={inputId}
      >{children}</label>
    </div>
  );
}

/**
 * @function
 * @param {Props} props
 * @returns {React.ReactNode}
 */
export default function InputGroup({ children, ...restProps }) {
  return children ? <InputGroupWithLabel {...restProps}>{children}</InputGroupWithLabel> : <Input {...restProps} />;
}
