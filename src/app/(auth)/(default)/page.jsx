"use client";

import { useSnapshot } from "valtio";
import IconUserPlus from "#src/icons/user/plus.svg";
import { HREF_HELP, PLATFORM_DESCRIPTION, PLATFORM_NAME } from "#src/lib/env";
import globalState from "#src/lib/state";
import LinkBackNormal from "#src/ui/link/back/normal";
import LinkNext from "#src/ui/link/next";
import styles from "./page.module.scss";

export default function PageAuthDefault() {
  const { profiles } = useSnapshot(globalState);

  return (
    <>
      <LinkBackNormal className={`${styles["page-back"]} hide-desktop`} href="#side">
        Home
      </LinkBackNormal>
      <div className={styles.page}>
        <h1 className={styles["page-title"]}>{PLATFORM_DESCRIPTION}</h1>
        <p>Public Beta version: 1.0</p>
        {!profiles?.length && (
          <>
            <p className={styles["page-text"]}>
              A profile is the foundation of your identity on <strong>{PLATFORM_NAME}</strong>. It allows you to centralize your digital
              footprint and showcase your content with the world.
            </p>
            <p className={styles["page-text"]}>Start by creating your first profile.</p>
            <div>
              <LinkNext href="/p#page">
                <IconUserPlus width="1.25em" />
                Create your first profile
              </LinkNext>
            </div>
          </>
        )}
        <footer className={styles["page-footer"]}>
          If you have any issues, you can visit the{" "}
          <a href={HREF_HELP} rel="noopener noreferrer" target="_blank">
            help page
          </a>
        </footer>
      </div>
    </>
  );
}
