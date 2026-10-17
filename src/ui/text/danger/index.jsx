import styles from "./index.module.scss";

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export default function TextDanger({ children }) {
  return <strong className={styles["text-danger"]}>{children}</strong>;
}
