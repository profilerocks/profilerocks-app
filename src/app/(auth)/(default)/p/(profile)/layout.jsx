import { Suspense } from "react";
import AuthProfile from "#src/ui/auth/profile";
import LinkBackNormal from "#src/ui/link/back/normal";
import LinkNextNormal from "#src/ui/link/next/normal";
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
          <LinkBackNormal href="#side" className={`hide-desktop ${styles["page-anchor-home"]}`}>
            Home
          </LinkBackNormal>
          <LinkNextNormal href="#preview" className={styles["page-anchor-preview"]}>
            Preview
          </LinkNextNormal>
        </header>
        {children}
      </AuthProfile>
    </Suspense>
  );
}
