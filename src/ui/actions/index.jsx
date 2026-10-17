import styles from "./index.module.scss";

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @returns {React.ReactNode}
 */
export default function Actions({ className: customClassName, children, ...restProps }) {
  let className = styles.actions;

  if (customClassName) {
    className += " " + customClassName;
  }

  return (
    <div className={className} {...restProps}>
      {children}
    </div>
  );
}
