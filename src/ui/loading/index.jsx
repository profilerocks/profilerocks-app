import IconLoading from "#src/icons/loading.svg";
import styles from "./index.module.scss";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function Loading() {
  return <IconLoading className={styles.loading} />;
}
