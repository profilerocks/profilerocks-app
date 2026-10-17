import styles from "./index.module.scss";

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @returns {React.ReactNode}
 */
export default function Requirements({ children, className, ...restProps }) {
  let computedClassName = styles.requirements;

  if (className) {
    computedClassName += " " + className;
  }

  return (
    <ul className={computedClassName} {...restProps}>
      {children}
    </ul>
  );
}
