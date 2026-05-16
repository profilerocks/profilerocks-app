import LogoLong from "#src/static/logo/long.svg";

import styles from "./index.module.scss";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function Header() {
  return (
    <header className={styles["header-top"]}>
      <LogoLong width="18em" />
    </header>
  );
}
