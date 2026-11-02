"use client";

import { useSnapshot } from "valtio";
import globalState from "#src/lib/state";

export function UserDisplayName(): React.ReactNode {
  const { displayName } = useSnapshot(globalState);

  return <p title={displayName}>{displayName}</p>;
}

export function UserEmail(): React.ReactNode {
  const { email, email2 } = useSnapshot(globalState);
  const displayEmail = email || email2;

  if (!displayEmail) {
    return null;
  }

  return (
    <p className="text-xs text-zinc-400" title={displayEmail}>
      {displayEmail}
    </p>
  );
}
