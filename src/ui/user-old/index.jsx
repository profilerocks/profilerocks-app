"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect } from "react";

import { useSnapshot } from "valtio";

import LinkActive from "#src/ui/link/active";
import MenuPhoto from "#src/ui/menu/photo";
import ButtonDialog from "#src/ui/button/dialog";
import DialogLogOut from "#src/ui/dialog/logout";
import LongWord from "#src/ui/text/long";
import longWordStyles from "#src/ui/text/long-word/index.module.scss";

import IconUser from "#src/icons/user/single.svg";
import IconUserPlus from "#src/icons/user/plus.svg";
import IconSettings from "#src/icons/settings.svg";
import IconLogout from "#src/icons/logout.svg";

import globalState from "#src/lib/state";

import StateUserEmail from "#src/lib/hooks/state/user/email";

import styles from "./index.module.scss";

function UserText() {
  const { name } = useSnapshot(globalState);

  return name ? (
    <>
      <span className={styles.welcome} title={name}>
        Welcome, {name}
      </span>
      <span className={styles.letter}>{name[0].toUpperCase()}</span>
    </>
  ) : (
    <>
      <span className={styles.welcome}>Welcome</span>
      <span className={styles.letter}>
        <IconUser width="1em" />
      </span>
    </>
  );
}

function UserName() {
  const { name } = useSnapshot(globalState);

  return name ? (
    <p className={`${styles["p-link"]} ${styles.name}`}>
      <LinkActive href="/u/settings#name" title={name} className={longWordStyles["long-word"]}>
        {name}
      </LinkActive>
    </p>
  ) : null;
}

/**
 * @function ProfileMapIteration
 * @param {Profile} profile
 * @param {number} i
 * @returns {React.ReactNode}
 */
function ProfileMapIteration(profile, i) {
  return (
    <li key={i}>
      <LinkActive href={`/p/${profile.name}`} className={styles["a-profile"]}>
        <MenuPhoto src={`https:/dev-profilerocks.s3.eu-central-003.backblazeb2.com/${profile.publicId}/photo`} />
        <LongWord>{profile.name}</LongWord>
      </LinkActive>
    </li>
  );
}

function UserProfiles() {
  const { profiles } = useSnapshot(globalState);

  return profiles?.map(ProfileMapIteration);
}

const ICON_DIMENSION = "1.5em";

export default function User() {
  /**
   * @type {React.RefObject<HTMLDetailsElement?>}
   */
  const detailsRef = useRef(null);

  const pathname = usePathname();

  useEffect(() => {
    const elDetails = detailsRef.current;

    if (elDetails) {
      /**
       * @function closeUserDropDownWhenClickingOutside
       * @param {MouseEvent} event
       */
      function closeUserDropDownWhenClickingOutside(event) {
        // @ts-expect-error
        if (elDetails?.open && !elDetails.contains(event.target)) {
          elDetails.open = false;
        }
      }

      document.addEventListener("mousedown", closeUserDropDownWhenClickingOutside);

      return () => {
        document.removeEventListener("mousedown", closeUserDropDownWhenClickingOutside);
      };
    }
  }, []);

  useEffect(() => {
    const detailsEl = detailsRef.current;

    if (detailsEl?.open) {
      detailsEl.removeAttribute("open");
    }
  }, [pathname]);

  return (
    <details className={styles["details-user"]} ref={detailsRef}>
      <summary>
        <UserText />
      </summary>
      <div className={styles.dropdown}>
        <UserName />
        <p className={styles["p-link"]}>
          <LinkActive href="/u/settings#email" className={longWordStyles["long-word"]}>
            <StateUserEmail />
          </LinkActive>
        </p>
        <menu className={styles.menu}>
          <UserProfiles />
          <li>
            <LinkActive href="/p">
              <IconUserPlus width={ICON_DIMENSION} />
              Create profile
            </LinkActive>
          </li>
          <li className={styles.settings}>
            <Link href="/u/settings">
              <IconSettings width={ICON_DIMENSION} />
              Settings
            </Link>
          </li>
          <li>
            <ButtonDialog className={styles["btn-log-out"]} Dialog={DialogLogOut}>
              <IconLogout width={ICON_DIMENSION} />
              Log Out
            </ButtonDialog>
          </li>
        </menu>
      </div>
    </details>
  );
}
