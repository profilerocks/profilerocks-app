import IconArrowRight from "#src/icons/arrow/right.svg";
import Button from "#src/ui/button";

/**
 * @function
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props
 * @returns {React.ReactNode}
 */
export default function ButtonNext({ children = "Next", ...buttonAttributes }) {
  return (
    <Button {...buttonAttributes}>
      {children}
      <IconArrowRight className="ms-auto" width="1.25em" />
    </Button>
  );
}
