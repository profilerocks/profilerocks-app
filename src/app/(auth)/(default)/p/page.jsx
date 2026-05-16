import { FormProfileNameIdPageWrapper } from "#src/ui/form/profile/name";
import LinkBackNormal from "#src/ui/link/back/normal";
import styles from "./page.module.scss";

export default function PageCreateProfile() {
  return (
    <>
      <LinkBackNormal className={`${styles["page-back"]} hide-desktop`} href="#side">
        Home
      </LinkBackNormal>
      <div className={styles.content}>
        <h1 className={styles["page-title"]}>Create a new profile</h1>
        <FormProfileNameIdPageWrapper />
      </div>
    </>
  );
}
