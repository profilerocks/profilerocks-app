import { FormProfileNameIdPageWrapper } from "#src/ui/form/profile/name";
import LinkBack from "#src/ui/link/back";
import styles from "./page.module.scss";

export default function PageCreateProfile() {
  return (
    <>
      <LinkBack className={`${styles["page-back"]} hide-desktop`} href="#side">
        Home
      </LinkBack>
      <div className={styles.content}>
        <h1 className={styles["page-title"]}>Create a new profile</h1>
        <FormProfileNameIdPageWrapper />
      </div>
    </>
  );
}
