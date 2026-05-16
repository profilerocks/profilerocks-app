import LinkBack from "#src/ui/link/back";
import Settings from "#src/ui/settings";
import SvgLogoLong from "#src/static/logo/long.svg";

import styles from "./page.module.scss";

/**
 * @type {import("next").Metadata}
 */
export const metadata = {
  title: "Settings",
  description: "Settings page"
};

export default function PageSettings() {
  return (
    <>
      <header className={styles.header}>
        <LinkBack className={styles["a-home"]} href="/#side" title="Home" />
        <h1 className={styles["page-title"]}>Settings</h1>
        <SvgLogoLong width="11em" className={styles["logo-long"]} />
      </header>
      <main className={styles.container}>
        <Settings />
      </main>
    </>
  );
}
