export type Props = Exclude<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "name" | "placeholder" | "minLength" | "maxLength" | "spellCheck" | "onBeforeInput" | "autoCapitalize" | "className"
> & {
  valid?: boolean;
};
