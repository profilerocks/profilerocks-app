"use client";

import useOnlineStatus from "#src/lib/hooks/online";
import IconOffline from "#src/icons/offline.svg";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function OnlineStatus() {
  const isOnline = useOnlineStatus();

  return isOnline ? null : (
    <aside className="fixed inset-x-0 inset-be-0 z-2 flex justify-center gap-2 bg-rose-500 text-zinc-950">
      <IconOffline width="1.125em" />
      You're offline
    </aside>
  );
}
