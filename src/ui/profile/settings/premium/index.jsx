import ProfileWatermark from "#src/ui/profile/watermark";
import SettingsProfileTitle from "#src/ui/profile/title";
import SettingsProfileMetaDescription from "#src/ui/profile/meta/description";
import styles from "./index.module.scss";

export default function ProfilePremiumSettings() {
  return (
    <fieldset className={styles["premium-settings"]}>
      <legend>Premium settings</legend>
      <p className={styles["premium-settings-description"]}>Settings only available for premium profiles.</p>
      <ProfileWatermark />
      <SettingsProfileTitle />
      <SettingsProfileMetaDescription />
    </fieldset>
  );
}
