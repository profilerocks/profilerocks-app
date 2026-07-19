import { Suspense } from "react";
import AuthProfile from "#src/ui/auth/profile";
import LinkBack from "#src/ui/link/back";
import LinkNext from "#src/ui/link/next";
// import LinkProfilePublic from "#src/ui/link/profile";
import styles from "./layout.module.scss";

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export default function LayoutProfile({ children }) {
  return (
    <Suspense>
      <AuthProfile>
        <header className={`hide-desktop-large ${styles["page-header"]}`}>
          <LinkBack href="#side" className={`hide-desktop ${styles["page-anchor-home"]}`}>
            Home
          </LinkBack>
          <LinkNext href="#preview" className={styles["page-anchor-preview"]}>
            Preview
          </LinkNext>
        </header>
        {children}
      </AuthProfile>
    </Suspense>
  );
}
