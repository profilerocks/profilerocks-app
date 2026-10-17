import styles from "./index.module.scss";

/**
 * @function
 * @param {any} props
 * @returns {React.ReactNode}
 */
export default function LongWord({ children, className, as: Tag = "span", ...restProps }) {
  return (
    <Tag className={className ? `${styles["long-word"]} ${className}` : styles["long-word"]} {...restProps}>
      {children}
    </Tag>
  );
}
