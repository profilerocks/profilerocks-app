import IconLoading from "#src/icons/loading.svg";

import styles from "./index.module.scss";

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export default function Message({ children }) {
  return (
    <div className={styles["container-message"]}>
      <IconLoading width="10em" className={styles["icon-loading"]} />
      <h1 className={styles.text}>{children}</h1>
      <p className={styles.wait}>Please wait</p>
    </div>
  );
}
