import IconLogout from "#src/icons/logout.svg";
import { showLogOutConfirm, showLogOutAllSessionsConfirm } from "#src/lib/confirm";
import Button from "#src/ui/button";
import styles from "./index.module.scss";

const ICON_DIMENSION = "1.5em";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function SettingsSessions() {
  return (
    <div id="sessions">
      <h1>Sessions</h1>
      <p>
        A session represents a logged-in device or browser. If you've logged in on a shared computer or suspect unauthorized activity, use
        the options below to secure your account.
      </p>
      <div className={styles.actions}>
        <Button onClick={showLogOutConfirm}>
          <IconLogout width={ICON_DIMENSION} />
          Log out of current session
        </Button>
        <div className={styles["section-compromised"]}>
          <p>Do you think your account has been compromised?</p>
          <p>Logging out of all sessions will terminate every active connection, including this one, requiring you to sign in again.</p>
          <Button onClick={showLogOutAllSessionsConfirm}>
            <IconLogout width={ICON_DIMENSION} />
            Log out of all sessions
          </Button>
        </div>
      </div>
    </div>
  );
}
