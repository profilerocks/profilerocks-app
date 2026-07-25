import { PLATFORM_NAME } from "#src/lib/env";
import OauthProvider from "#src/ui/settings/oauth/provider";
import IconColoredGoogle from "#src/icons/colored/google.svg";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function SettingsOauth() {
  return (
    <div id="oauth">
      <h1 className="text-3xl">Linked accounts</h1>
      <p className="text-zinc-200 my-4">Linking your account with other services offers you a secure, easier, and faster way to sign in.</p>
      <p className="text-zinc-200">
        <strong>{PLATFORM_NAME}</strong> does not access your linked accounts information persistently, only your email address and name
        when you log in.
      </p>
      <div className="mbs-7">
        <OauthProvider Icon={IconColoredGoogle} provider="google" />
      </div>
    </div>
  );
}
