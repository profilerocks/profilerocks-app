import ArrowRight from "#src/ui/arrow/right";
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
      <ArrowRight />
    </Button>
  );
}
