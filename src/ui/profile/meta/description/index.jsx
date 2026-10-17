import FormProfileMetaDescription from "#src/ui/form/profile/meta/description";
import styles from "./index.module.scss";

export default function SettingsProfileMetaDescription() {
  return (
    <div className={styles["settings-profile-meta-description"]}>
      <h2 className={styles["settings-title"]}>Meta description</h2>
      <p>A meta description appears in search results and social media previews to summarize the page content.</p>
      <FormProfileMetaDescription />
    </div>
  );
}
