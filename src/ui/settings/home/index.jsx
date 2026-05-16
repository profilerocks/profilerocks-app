import LinkEdit from "#src/ui/link/edit";
import LinkNext from "#src/ui/link/next";
import { useUserEmail as StateUserEmail, useUserDisplayName as StateUserDisplayName } from "#src/lib/hooks/state";
import IconCard from "#src/icons/card.svg";
import IconConnect from "#src/icons/connect.svg";
import IconDevices from "#src/icons/devices.svg";
import IconEmail from "#src/icons/email.svg";
import IconLogout from "#src/icons/logout.svg";
import IconUser from "#src/icons/user/single.svg";
import IconUserData from "#src/icons/user/data.svg";
import ButtonDialog from "#src/ui/button/dialog";
import DialogLogOut from "#src/ui/dialog/logout";
import Minimap from "#src/ui/minimap";
import styles from "./index.module.scss";

const ICON_MAIN_SIZE = "2.875em";
const ICON_DIMENSION = "1.5em";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function SettingsHome() {
  return (
    <div id="home">
      <h1>Information</h1>
      <div className={styles["settings-main"]}>
        <div className={styles["settings-main-article"]}>
          <div className={styles["settings-main-article-header"]}>
            <IconEmail width={ICON_MAIN_SIZE} />
            <hgroup className={styles["settings-main-article-hgroup"]}>
              <h2>Email address</h2>
              <p>The address used to identify your account and contact</p>
            </hgroup>
          </div>
          <LinkEdit href="#email">
            <StateUserEmail />
          </LinkEdit>
        </div>
        <article className={styles["settings-main-article"]}>
          <div className={styles["settings-main-article-header"]}>
            <IconUser width={ICON_MAIN_SIZE} />
            <hgroup className={styles["settings-main-article-hgroup"]}>
              <h2>Name</h2>
              <p>For contact information</p>
            </hgroup>
          </div>
          <LinkEdit href="#name">
            <StateUserDisplayName />
          </LinkEdit>
        </article>
      </div>
      <nav>
        <ul className={styles["list-nav"]}>
          <li>
            <LinkNext href="#oauth">
              <IconConnect width={ICON_DIMENSION} />
              Linked accounts
            </LinkNext>
          </li>
          <li>
            <LinkNext href="#sessions">
              <IconDevices width={ICON_DIMENSION} />
              Sessions
            </LinkNext>
          </li>
          <li>
            <LinkNext href="#payments">
              <IconCard width={ICON_DIMENSION} />
              Payments
            </LinkNext>
          </li>
          <li>
            <LinkNext href="#data">
              <IconUserData width={ICON_DIMENSION} />
              My data
            </LinkNext>
          </li>
        </ul>
      </nav>
      <ButtonDialog Dialog={DialogLogOut} className={styles["btn-logout"]}>
        <IconLogout width={ICON_DIMENSION} />
        Log out of current session
      </ButtonDialog>
      <Minimap />
    </div>
  );
}
