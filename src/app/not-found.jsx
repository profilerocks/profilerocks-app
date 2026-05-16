"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import IconRobotConfused from "#src/icons/robot/confused.svg";
import { HREF_PROFILE } from "#src/lib/env";
import { isProfileNameIdValid } from "#src/lib/profile";
import Minimap from "#src/ui/minimap";
import styles from "./not-found.module.scss";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    const normalizedPathname = pathname
      .substring(1) // Remove leading slash
      .replace(/\/+$/, "") // Remove trailing slashes
      .toLowerCase();

    if (isProfileNameIdValid(normalizedPathname)) {
      window.location.replace(new URL(normalizedPathname, HREF_PROFILE));
    } else {
      const mainEl = document.querySelector("main");
      if (mainEl) {
        mainEl.style.opacity = "1";
      }
    }
  }, [pathname]);

  return (
    <main className={styles.page}>
      <figure className={styles["figure-not-found"]}>
        <IconRobotConfused />
        <figcaption>
          <h1>404</h1>
          <p>Not found</p>
        </figcaption>
      </figure>
      <p className={styles.quote}>
        <q>Looks like this page took a wrong turn... Maybe it&#39;s lost in the internet void, or just grabbing a coffee.</q>
      </p>
      <Minimap />
    </main>
  );
}
