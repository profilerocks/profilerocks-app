import EditProfileHeader from "#src/ui/form/profile/header";

import styles from "./page.module.scss";

export default function PageSetupProfileHeader() {
  return (
    <>
      <h1 className={styles["page-title"]}>Add your personal touch</h1>
      <EditProfileHeader />
    </>
  );
}
