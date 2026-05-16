import Button from "#src/ui/button";
import styles from "./index.module.scss";

/**
 * @function
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props
 * @returns {React.ReactNode}
 */
export default function ButtonDanger({ className: customClassName, children, ...buttonAttributes }) {
  let className = styles["btn-danger"];

  if (customClassName) {
    className += " " + customClassName;
  }

  return (
    <Button className={className} {...buttonAttributes}>
      {children}
    </Button>
  );
}
