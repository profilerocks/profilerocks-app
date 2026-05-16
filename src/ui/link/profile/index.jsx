"use client";

import { useSnapshot } from "valtio";
import { API } from "#src/lib/env";
import globalState from "#src/lib/state";
import styles from "./index.module.scss";

export default function LinkProfilePublic() {
  const { currentProfile } = useSnapshot(globalState);
  const href = API + "/" + currentProfile?.name_id;

  return currentProfile ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={styles["link-profile-public"]}>
      {new URL(href).host + "/" + currentProfile?.name_id}
    </a>
  ) : null;
}
