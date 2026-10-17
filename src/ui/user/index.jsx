import IconSettings from "#src/icons/settings.svg";
import LinkPillOutline from "#src/ui/link/pill/outline";
import { UserDisplayName, UserEmail } from "#src/ui/user/client";
import styles from "./index.module.scss";

export default function User() {
  return (
    <div className={styles["user-container"]}>
      <div className={styles["user-info"]}>
        <UserDisplayName />
        <UserEmail />
      </div>
      <LinkPillOutline className={styles["link-settings"]} href="/u/settings" title="User settings">
        <IconSettings className={styles["icon-settings"]} width="1.75em" />
      </LinkPillOutline>
    </div>
  );
}
