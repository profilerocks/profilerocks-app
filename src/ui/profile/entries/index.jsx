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
  const active = pathname.startsWith("/p/") && searchParams.get("id") === profile.public_id;

  return (
    <Link
      className="flex flex-1 items-center gap-3.5 overflow-hidden p-4 transition-colors select-none hover:bg-zinc-800 hover:text-zinc-100 active:bg-zinc-700 active:text-zinc-100"
      href={"/p/content?id=" + profile.public_id + "#page"}
    >
      <img
        src={profile.photo ? HREF_ASSETS + "/profile/" + profile.public_id + "/photo" : "/user.png"}
        alt="Profile photo"
        width="48"
        height="48"
        draggable="false"
        className="rounded-full shadow-xs"
      />
      <div className="flex flex-1 items-center gap-3.5 overflow-hidden p-4 transition-colors">
        <p className={"truncate text-lg transition-colors " + (active ? "text-emerald-400" : "text-zinc-300")}>
          {profile.display_name || profile.name_id}
        </p>
        <p className="truncate text-sm text-zinc-400 transition-colors">{profile.name_id}</p>
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
  return <ProfileEntry key={index} profile={profile} />;
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
          <div className="select-none">
            {
              // @ts-ignore
              profiles.map(profileEntryCallback)
            }
          </div>
        </Suspense>
      ) : null}
      <menu className="flex flex-wrap gap-x-6 gap-y-4 px-4 *:flex-1">
        {profilesRemaining > 0 && (
          <li>
            <LinkPillSolidActive className="pe-3.5" href="/p#page">
              <IconUserPlus width="1.5em" />
              Create a new profile
            </LinkPillSolidActive>
          </li>
        )}
        <li>
          <LinkNext className="hover:*:rotate-360" href="/u/settings">
            <IconSettings className="transition-transform duration-1000" width="1.5em" />
            User Settings
          </LinkNext>
        </li>
      </menu>
      <p className="my-6 text-center text-sm text-zinc-500">You can create up to {profileAttributes.limit} profiles</p>
      {profiles?.length ? (
        <p className="text-center text-sm text-zinc-500">
          {profilesRemaining} more profile{profilesRemaining !== 1 ? "s" : ""} available
        </p>
      ) : null}
    </>
  );
}
