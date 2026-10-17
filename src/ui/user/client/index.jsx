"use client";

import { useSnapshot } from "valtio";
import globalState from "#src/lib/state";
import styles from "./index.module.scss";

export function UserDisplayName() {
  const { displayName } = useSnapshot(globalState);

  return (
    <p className={styles["p-display-name"]} title={displayName}>
      {displayName}
    </p>
  );
}

export function UserEmail() {
  const { email, email2 } = useSnapshot(globalState);
  const displayEmail = email || email2;

  if (!displayEmail) {
    return null;
  }

  return (
    <p className={styles["p-email"]} title={displayEmail}>
      {displayEmail}
    </p>
  );
}
