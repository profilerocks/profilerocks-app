import { PLATFORM_NAME } from "#src/lib/env";
import OauthProvider from "#src/ui/settings/oauth/provider";
import IconColoredGoogle from "#src/icons/colored/google.svg";
import styles from "./index.module.scss";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function SettingsOauth() {
  return (
    <div id="oauth">
      <h1>Linked accounts</h1>
      <p>Linking your account with other services offers you a secure, easier, and faster way to sign in.</p>
      <p>
        <strong>{PLATFORM_NAME}</strong> does not access your linked accounts information persistently, only your email address and name
        when you log in.
      </p>
      <div className={styles["oauth-container"]}>
        <OauthProvider Icon={IconColoredGoogle} provider="google" />
      </div>
    </div>
  );
}
