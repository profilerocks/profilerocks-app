import { useState } from "react";
import { alertErrorApp } from "#src/lib/alert";
import IconBin from "#src/icons/bin.svg";
import { requestUserDeletion } from "#src/lib/request";
import { deleteUserState } from "#src/lib/state/user";
import ButtonDownloadAccountData from "#src/ui/button/download/account";
import ButtonDanger from "#src/ui/button/danger";
import styles from "./index.module.scss";

/**
 * @function Delete
 * @returns {React.ReactNode}
 */
function Delete() {
  const stateSubmit = useState(false);
  const [isSubmitting, setIsSubmitting] = stateSubmit;

  async function deleteAccountOnClick(/*event: MouseEventButton*/) {
    if (!confirm("Are you sure you want to delete your account?")) {
      return;
    }

    setIsSubmitting(true);

    const res = await requestUserDeletion();

    if (!res) {
      return;
    }

    deleteUserState();

    if (!res.ok) {
      alertErrorApp();
    }
  }

  return (
    <div>
      <p>
        Closing your account is a permanent action. All your profile memberships, active premium subscriptions, and personal information{" "}
        <strong>will be deleted permanently and will not be recoverable</strong>.
      </p>
      <p>
        Please ensure you have downloaded any important data before proceeding, as accounts cannot be restored once the deletion process is
        complete.
      </p>
      <ButtonDanger onClick={deleteAccountOnClick} disabled={isSubmitting}>
        <IconBin width="1.25em" />
        Delete your account
      </ButtonDanger>
    </div>
  );
}

export default function SettingsData() {
  return (
    <div id="data">
      <h1>My data</h1>
      <div className={styles.container}>
        <p>
          All data associated with your account can be manually exported and downloaded at any time, ensuring complete access and
          portability of your information. You can also export each profile data separately in the profile settings and{" "}
          <strong>Polar.sh</strong> data in the <a href="#payments">payments</a> settings.
        </p>
        <p>Your data is exported in a standard, machine-readable JSON format, allowing you to easily view it.</p>
        <ButtonDownloadAccountData />
      </div>
      <div className={styles.container + " " + styles["container-delete"]}>
        <h2 className={styles["title-delete"]}>Delete account</h2>
        <Delete />
      </div>
    </div>
  );
}
