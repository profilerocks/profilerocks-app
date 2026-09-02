import IconLogout from "#src/icons/logout.svg";
import { showLogOutConfirm, showLogOutAllSessionsConfirm } from "#src/lib/confirm";
import Button from "#src/ui/button";

const ICON_DIMENSION = "1.5em";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function SettingsSessions() {
  return (
    <div id="sessions">
      <h1 className="text-3xl">Sessions</h1>
      <p className="my-4">
        A session represents a logged-in device or browser. If you've logged in on a shared computer or suspect unauthorized activity, use
        the options below to secure your account.
      </p>
      <div className="flex flex-col items-start gap-4">
        <Button className="pe-3.5" onClick={showLogOutConfirm}>
          <IconLogout width={ICON_DIMENSION} />
          Log out of current session
        </Button>
        <div className="mbs-4 border-bs border-zinc-700 pbs-2">
          <h2 className="my-4 text-xl">Do you think your account has been compromised?</h2>
          <p className="my-4">
            Logging out of all sessions will terminate every active connection, including this one, requiring you to sign in again.
          </p>
          <Button className="pe-3.5" onClick={showLogOutAllSessionsConfirm}>
            <IconLogout width={ICON_DIMENSION} />
            Log out of all sessions
          </Button>
        </div>
      </div>
    </div>
  );
}
