import LogoLong from "#src/static/logo/long.svg";
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
      <header className="max-w-2xl w-full mx-auto mbs-4">
        <LogoLong width="18em" />
      </header>
      <main className={styles["user-enter-page"]}>{children}</main>
      <footer className={styles["footer-bottom"]}>
        <Minimap />
      </footer>
    </>
  );
}
