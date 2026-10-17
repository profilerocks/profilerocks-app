import styles from "./layout.module.scss";

/**
 * @param {{ children: React.ReactNode }} props
 */
export default function LayoutProfileSetup({ children }) {
  return <div className={styles.container}>{children}</div>;
}
