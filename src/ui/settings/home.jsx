import IconCard from "#src/icons/card.svg";
import IconConnect from "#src/icons/connect.svg";
import IconDevices from "#src/icons/devices.svg";
import IconEmail from "#src/icons/email.svg";
import IconLogout from "#src/icons/logout.svg";
import IconSad from "#src/icons/sad.svg";
import IconUser from "#src/icons/user/single.svg";
import IconUserData from "#src/icons/user/data.svg";
import { showLogOutConfirm } from "#src/lib/confirm";
import { useUserEmail as StateUserEmail, useUserDisplayName as StateUserDisplayName } from "#src/lib/hooks/state";
import Button from "#src/ui/button";
import LinkEdit from "#src/ui/link/edit";
import LinkNext from "#src/ui/link/next";
import Minimap from "#src/ui/minimap";

const ICON_MAIN_SIZE = "2.875em";
const ICON_DIMENSION = "1.5em";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function SettingsHome() {
  return (
    <div id="home">
      <h1 className="text-3xl">Information</h1>
      <div className="mbs-5 flex flex-col gap-5">
        <div className="overflow-hidden rounded-2xl border-2 border-zinc-700 bg-zinc-950">
          <div className="flex items-start justify-start gap-4 border-be-2 border-be-zinc-700 px-4 py-3.5">
            <IconEmail className="min-w-max text-zinc-300 drop-shadow-xs drop-shadow-black" width={ICON_MAIN_SIZE} />
            <hgroup>
              <h2 className="text-xl">Email address</h2>
              <p className="text-sm text-zinc-300">The address used to identify your account and contact</p>
            </hgroup>
          </div>
          <LinkEdit href="#email">
            <StateUserEmail />
          </LinkEdit>
        </div>
        <div className="overflow-hidden rounded-2xl border-2 border-zinc-700 bg-zinc-950">
          <div className="flex items-start justify-start gap-4 border-be-2 border-be-zinc-700 px-4 py-3.5">
            <IconUser className="min-w-max text-zinc-300 drop-shadow-xs drop-shadow-black" width={ICON_MAIN_SIZE} />
            <hgroup>
              <h2 className="text-xl">Name</h2>
              <p className="text-sm text-zinc-300">For contact information</p>
            </hgroup>
          </div>
          <LinkEdit href="#name">
            <StateUserDisplayName />
          </LinkEdit>
        </div>
      </div>
      <nav className="my-7 grid gap-x-6 gap-y-4 border-be border-zinc-700 pbe-6 sm:grid-cols-2">
        <LinkNext href="#oauth">
          <IconConnect className="drop-shadow-xs drop-shadow-black" width={ICON_DIMENSION} />
          Linked accounts
        </LinkNext>
        <LinkNext href="#sessions">
          <IconDevices className="drop-shadow-xs drop-shadow-black" width={ICON_DIMENSION} />
          Sessions
        </LinkNext>
        <LinkNext href="#payments">
          <IconCard className="drop-shadow-xs drop-shadow-black" width={ICON_DIMENSION} />
          Payments
        </LinkNext>
        <LinkNext href="#data">
          <IconUserData className="drop-shadow-xs drop-shadow-black" width={ICON_DIMENSION} />
          My data
        </LinkNext>
      </nav>
      <Button onClick={showLogOutConfirm} className="w-full">
        <IconLogout width={ICON_DIMENSION} />
        Log out of current session
        <IconSad className="ms-auto" width={ICON_DIMENSION} />
      </Button>
      <Minimap className="mbs-12" />
    </div>
  );
}
