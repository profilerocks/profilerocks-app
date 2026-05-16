"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import IconSettings from "#src/icons/settings.svg";
import IconUser from "#src/icons/user/single.svg";
import { useUserEmail as StateUserEmail, useUserDisplayName as StateUserDisplayName } from "#src/lib/hooks/state";
// import ButtonLogOut from "#src/ui/button/logout";
import Minimap from "#src/ui/minimap";
import styles from "./index.module.scss";

const ICON_SIZE = "1.5em";

export default function User() {
  /**
   * @type {React.RefObject<HTMLDetailsElement?>}
   */
  const detailsRef = useRef(null);

  useEffect(() => {
    const detailsEl = detailsRef.current;

    if (detailsEl) {
      /**
       * @function closeUserDropDownOnMousedown
       * @param {MouseEvent} event
       */
      function closeUserDropDownOnMousedown(event) {
        // @ts-expect-error
        if (detailsEl?.open && !detailsEl.contains(event.target)) {
          detailsEl.open = false;
        }
      }

      document.addEventListener("mousedown", closeUserDropDownOnMousedown);

      return () => {
        document.removeEventListener("mousedown", closeUserDropDownOnMousedown);
      };
    }
  }, []);

  return (
    <details name="user-details" className={styles["user-details"]} ref={detailsRef}>
      <summary title="User" aria-description={StateUserDisplayName()}>
        <IconUser width={ICON_SIZE} />
      </summary>
      <div className={styles.dropdown}>
        <Link href="/u/settings" title="User Settings" className={styles["link-settings"]}>
          <div>
            <p className={styles["p-display-name"]}>
              <StateUserDisplayName />
            </p>
            <p className={styles["p-email"]}>
              <StateUserEmail />
            </p>
          </div>
          <IconSettings width="2.5em" className={styles["icon-settings"]} />
        </Link>
        <div className={styles["container-actions"]}>{/*<ButtonLogOut className={styles["btn-logout"]}>Log Out</ButtonLogOut>*/}</div>
        <Minimap className={styles.minimap} />
      </div>
    </details>
  );
}
