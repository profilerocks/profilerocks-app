import FormProfileTitle from "#src/ui/form/profile/title";
import styles from "./index.module.scss";

export default function SettingsProfileTitle() {
  return (
    <div className={styles["settings-profile-title"]}>
      <h2 className={styles["settings-title"]}>Page title</h2>
      <p>A web page title appears in browser tabs, search results, bookmarks, and social media previews.</p>
      <FormProfileTitle />
    </div>
  );
}
