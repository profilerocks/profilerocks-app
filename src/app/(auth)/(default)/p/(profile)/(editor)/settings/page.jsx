import Link from "next/link";
import ButtonDeleteProfileMembership from "#src/ui/button/danger/delete/profile";
import ButtonDownloadProfileData from "#src/ui/button/download/profile";
import { FormProfileNameIdUpdate } from "#src/ui/form/profile/name";
import ProfileCurrentPlan from "#src/ui/profile/current/plan";
import ProfilePremiumSettings from "#src/ui/profile/settings/premium";
import styles from "./page.module.scss";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function PageProfileSettings() {
  return (
    <>
      <h1>Profile Settings</h1>
      <ProfileCurrentPlan />
      <ProfilePremiumSettings />
      <h2>Change profile name</h2>
      <FormProfileNameIdUpdate />
      <h2 className={styles["title-separate"]}>Profile data</h2>
      <p>
        You can export the profile data in a standard, machine-readable JSON format. The option to export your account data can be found in
        the <Link href="/u/settings#data">account settings</Link>.
      </p>
      <ButtonDownloadProfileData />
      <h2 className={`${styles["title-danger"]} ${styles["title-separate"]}`}>Danger zone</h2>
      <p>
        After deletion, the profile and its associated plan will be <strong>permanently removed and cannot be recovered</strong>.
      </p>
      <ButtonDeleteProfileMembership />
    </>
  );
}
