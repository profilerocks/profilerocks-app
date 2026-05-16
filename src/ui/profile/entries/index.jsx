"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useSnapshot } from "valtio";
import profileAttributes from "#shared/profile.json";
import IconSettings from "#src/icons/settings.svg";
import IconUserPlus from "#src/icons/user/plus.svg";
import { HREF_ASSETS } from "#src/lib/env";
import globalState from "#src/lib/state";
import LinkNext from "#src/ui/link/next";
import LinkPillSolidActive from "#src/ui/link/pill/solid/active";
import styles from "./index.module.scss";

/**
 * @import {Profile} from "#src/lib/state"
 */

/**
 * It uses `useSearchParams`, so it needs to be wrapped in a Suspense boundary.
 *
 * @function ProfileEntry
 * @param {Object} props
 * @param {Readonly<Profile>} props.profile
 * @returns {React.ReactNode}
 */
function ProfileEntry({ profile }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let className = styles["profile-item-link"];

  if (pathname.startsWith("/p/") && searchParams.get("id") === profile.public_id) {
    className += " " + styles["profile-item-link-active"];
  }

  return (
    <Link href={"/p/content?id=" + profile.public_id + "#page"} className={className}>
      <img
        src={profile.photo ? HREF_ASSETS + "/profile/" + profile.public_id + "/photo" : "/user.png"}
        alt="Profile photo"
        width="48"
        height="48"
        draggable="false"
        className={styles["profile-photo"]}
      />
      <div className={styles["profile-info"]}>
        <p className={styles["profile-display-name"]}>{profile.display_name || profile.name_id}</p>
        <p className={styles["profile-name-id"]}>{profile.name_id}</p>
      </div>
    </Link>
  );
}

/**
 * @function profileEntryCallback
 * @param {Readonly<Profile>} profile
 * @param {number} index
 * @returns {React.ReactNode}
 */
function profileEntryCallback(profile, index) {
  return (
    <li key={index}>
      <ProfileEntry profile={profile} />
    </li>
  );
}

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function ProfileList() {
  const { profiles } = useSnapshot(globalState);
  const profilesRemaining = profileAttributes.limit - (profiles?.length ?? 0);

  return (
    <>
      {profiles?.length ? (
        <Suspense>
          {/* @ts-ignore */}
          <ul className={styles["profile-list"]}>{profiles.map(profileEntryCallback)}</ul>
        </Suspense>
      ) : null}
      <menu className={styles["menu-actions"]}>
        {profilesRemaining > 0 && (
          <li>
            <LinkPillSolidActive href="/p#page">
              <IconUserPlus width="1.5em" />
              Create a new profile
            </LinkPillSolidActive>
          </li>
        )}
        <li>
          <LinkNext href="/u/settings" className={styles["link-settings"]}>
            <IconSettings width="1.5em" className={styles["icon-settings"]} />
            User Settings
          </LinkNext>
        </li>
      </menu>
      <p className={styles["p-limit"]}>You can be a member of up to {profileAttributes.limit} profiles</p>
      {profiles?.length ? (
        <p className={styles["p-remaining"]}>
          {profilesRemaining} more profile{profilesRemaining !== 1 ? "s" : ""} available
        </p>
      ) : null}
    </>
  );
}
