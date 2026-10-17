"use client";

import useOnlineStatus from "#src/lib/hooks/online";
import IconOffline from "#src/icons/offline.svg";
import styles from "./index.module.scss";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function OnlineStatus() {
  const isOnline = useOnlineStatus();

  return isOnline ? null : (
    <aside className={styles["container-offline"]}>
      <figure className={styles["figure-offline"]}>
        <IconOffline width="1.125em" />
        <figcaption>You're offline</figcaption>
      </figure>
    </aside>
  );
}
