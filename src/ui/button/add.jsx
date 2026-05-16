import IconPlus from "#src/icons/plus.svg";
import Button from "#src/ui/button";

/**
 * @function
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props
 * @returns {React.ReactNode}
 */
export default function ButtonAdd({ children, ...props }) {
  return (
    <Button {...props}>
      <IconPlus width="1.25em" />
      {children}
    </Button>
  );
}
