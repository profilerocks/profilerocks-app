import HeaderMinimal from "#src/ui/header/minimal";
import Minimap from "#src/ui/minimap";

import styles from "./layout.module.scss";

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export default function LayoutForm({ children }) {
  return (
    <>
      <HeaderMinimal />
      <main className={styles["user-enter-page"]}>{children}</main>
      <footer className={styles["footer-bottom"]}>
        <Minimap />
      </footer>
    </>
  );
}
