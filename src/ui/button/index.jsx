import styles from "./index.module.scss";

/**
 * @function
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props
 * @returns {React.ReactNode}
 */
export default function Button({ className: customClassName, children, ...buttonAttributes }) {
  let className = styles.btn;

  if (customClassName) {
    className += " " + customClassName;
  }

  return (
    <button className={className} {...buttonAttributes}>
      {children}
    </button>
  );
}
