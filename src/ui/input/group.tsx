import type React from "react";
import { useId } from "react";

export interface InputGroupProps extends React.ComponentPropsWithoutRef<"input"> {
  ref?: React.Ref<HTMLInputElement>;
}

function Input({ className: customClassName, ...restProps }: Omit<InputGroupProps, "children">): React.ReactNode {
  return (
    <input
      {...restProps}
      className={
        "w-full rounded-lg border-2 border-zinc-700 bg-clip-text p-3 caret-emerald-400 outline-hidden transition-colors user-invalid:border-rose-500 focus:border-emerald-400" +
        (customClassName ? " " + customClassName : "")
      }
    />
  );
}

function InputGroupWithLabel({ children, placeholder = " ", ref, ...restProps }: InputGroupProps): React.ReactNode {
  const inputId = useId();

  return (
    <div className="relative pbs-2.5 select-none">
      {/* `background-clip: text` fixes autofill background in Chrome */}
      <Input
        {...restProps}
        className="peer placeholder:text-transparent placeholder:transition-colors focus:placeholder:text-zinc-400"
        id={inputId}
        placeholder={placeholder}
        ref={ref}
      />
      <label
        className="absolute inset-s-2.5 inset-bs-0 flex cursor-text gap-1.5 bg-black px-1.5 text-sm text-zinc-300 transition-all peer-not-focus:peer-placeholder-shown:inset-s-2 peer-not-focus:peer-placeholder-shown:inset-bs-6 peer-not-focus:peer-placeholder-shown:text-base peer-user-invalid:text-rose-400 peer-focus:text-emerald-400"
        htmlFor={inputId}
      >
        {children}
      </label>
    </div>
  );
}

export default function InputGroup({ children, ...restProps }: InputGroupProps): React.ReactNode {
  return children ? <InputGroupWithLabel {...restProps}>{children}</InputGroupWithLabel> : <Input {...restProps} />;
}
