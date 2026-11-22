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
import AnchorNext from "#src/ui/link/next";
import Minimap from "#src/ui/minimap";

const ICON_MAIN_SIZE = "2.875em";
const ICON_DIMENSION = "1.5em";

export default function SettingsHome(): React.ReactNode {
  return (
    <div id="home">
      <h1 className="text-3xl">Information</h1>
      <div className="mbs-5 flex flex-col gap-5 *:overflow-hidden *:rounded-lg *:border-2 *:border-zinc-700 *:bg-zinc-950">
        <div>
          <div className="flex items-start justify-start gap-4 border-be-2 border-zinc-700 px-4 py-3.5">
            <IconEmail className="min-w-max text-zinc-300 drop-shadow-xs drop-shadow-black" width={ICON_MAIN_SIZE} />
            <hgroup>
              <h2 className="text-xl">Email address</h2>
              <p className="text-sm text-zinc-400">The address used to identify your account and contact</p>
            </hgroup>
          </div>
          <LinkEdit href="#email">
            <StateUserEmail />
          </LinkEdit>
        </div>
        <div>
          <div className="flex items-start justify-start gap-4 border-be-2 border-zinc-700 px-4 py-3.5">
            <IconUser className="min-w-max text-zinc-300 drop-shadow-xs drop-shadow-black" width={ICON_MAIN_SIZE} />
            <hgroup>
              <h2 className="text-xl">Name</h2>
              <p className="text-sm text-zinc-400">For contact information</p>
            </hgroup>
          </div>
          <LinkEdit href="#name">
            <StateUserDisplayName />
          </LinkEdit>
        </div>
      </div>
      <nav className="my-7 flex flex-col flex-wrap gap-x-6 gap-y-0.5 border-be border-zinc-700 pbe-6 *:flex *:min-w-max *:flex-1 *:items-center *:gap-2.5 *:bg-zinc-900 *:p-2.5 *:font-medium *:text-zinc-400 *:transition-colors *:select-none *:hover:bg-zinc-800 *:hover:text-zinc-300 *:active:bg-zinc-700 *:active:text-zinc-200 sm:flex-row sm:gap-y-4 sm:*:basis-3xs sm:*:rounded-lg">
        <AnchorNext className="rounded-t-lg" href="#oauth">
          <IconConnect className="drop-shadow-xs drop-shadow-black" width={ICON_DIMENSION} />
          Linked accounts
        </AnchorNext>
        <AnchorNext href="#sessions">
          <IconDevices className="drop-shadow-xs drop-shadow-black" width={ICON_DIMENSION} />
          Sessions
        </AnchorNext>
        <AnchorNext href="#payments">
          <IconCard className="drop-shadow-xs drop-shadow-black" width={ICON_DIMENSION} />
          Payments
        </AnchorNext>
        <AnchorNext className="rounded-b-lg" href="#data">
          <IconUserData className="drop-shadow-xs drop-shadow-black" width={ICON_DIMENSION} />
          My data
        </AnchorNext>
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
