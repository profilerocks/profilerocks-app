"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSnapshot } from "valtio";
import IconContent from "#src/icons/content.svg";
import IconPencil from "#src/icons/pencil.svg";
import IconStyle from "#src/icons/style.svg";
// import IconUsers from "#src/icons/user/multiple.svg";
import IconSettings from "#src/icons/settings.svg";
import { showAlertErrorApp } from "#src/lib/alert";
import { HREF_ASSETS } from "#src/lib/env";
import { requestProfileData } from "#src/lib/request";
import globalState from "#src/lib/state";
import { updateProfileState } from "#src/lib/state/profile";
import LinkPillSolid from "#src/ui/link/pill/solid";

const ICON_DIMENSION = "1.75rem";
const TITLE_EDIT_PROFILE_HEADER = "Edit profile header";

function FigureProfileContent() {
  const { currentProfile } = useSnapshot(globalState);

  if (!currentProfile) {
    return null;
  }

  const href = "/p/setup/header?id=" + currentProfile.public_id + "#page";

  return (
    <>
      <Link href={href} title={TITLE_EDIT_PROFILE_HEADER}>
        <img
          alt="Profile photo"
          draggable="false"
          className="rounded-full"
          height="50"
          src={currentProfile.photo ? HREF_ASSETS + "/profile/" + currentProfile.public_id + "/photo" : "/user.png"}
          width="50"
        />
      </Link>
      <figcaption className="flex max-w-full flex-1 items-center justify-between gap-3 overflow-hidden">
        <div className="overflow-hidden whitespace-nowrap">
          <Link className="truncate" href={href} title={TITLE_EDIT_PROFILE_HEADER}>
            {currentProfile.display_name || currentProfile.name_id}
          </Link>
          <p className="truncate text-sm text-zinc-400" title={currentProfile.name_id}>
            {currentProfile.name_id}
          </p>
        </div>
        <LinkPillSolid className="m-1" href={href} title={TITLE_EDIT_PROFILE_HEADER}>
          <span className="hidden ps-1 sm:inline">Edit</span>
          <IconPencil className="min-w-6" />
        </LinkPillSolid>
      </figcaption>
    </>
  );
}

/**
 * @function LinkProfileConfiguration
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.path
 */
function LinkProfileConfiguration({ children, path }) {
  const { currentProfile } = useSnapshot(globalState);
  const pathname = usePathname();

  if (!currentProfile) {
    return null;
  }

  let active = pathname.includes(path);

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "text-emerald-400! before:inset-x-6! before:bg-zinc-900 hover:before:bg-zinc-800 active:before:bg-zinc-700 sm:before:inset-x-1!"
          : undefined
      }
      href={"/p/" + path + "?id=" + currentProfile.public_id + "#page"}
    >
      {children}
    </Link>
  );
}

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export default function LayoutProfile({ children }) {
  const [loading, setLoading] = useState(false);
  const { currentProfile } = useSnapshot(globalState);

  async function getProfileData() {
    if (loading || !currentProfile) {
      return;
    }

    setLoading(true);

    const res = await requestProfileData(currentProfile.public_id);

    setLoading(false);

    if (!res) {
      return;
    }

    const profileState = await res.json();

    profileState.theme ??= "AAAAAAAAAAAAAAAAAAAAAAAA";
    profileState.watermark = profileState.watermark !== 0 && profileState.watermark !== false;

    if (!res.ok || !updateProfileState(currentProfile.public_id, profileState)) {
      showAlertErrorApp();
    }
  }

  useEffect(() => {
    getProfileData();
    location.hash = "#page";
  }, [currentProfile?.public_id]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
      <figure className="m-4 flex min-h-max max-w-full items-center gap-3.5 overflow-hidden select-none">
        <FigureProfileContent />
      </figure>
      <div className="px-4 pbe-12">{loading ? "Loading..." : children}</div>
      <nav className="sticky inset-be-0 z-2 mbs-auto flex border-bs border-zinc-700 bg-zinc-950/80 text-xs text-zinc-400 shadow-black backdrop-blur-sm select-none *:relative *:flex *:flex-1 *:flex-col *:items-center *:gap-1 *:p-2.5 *:transition-colors *:before:absolute *:before:inset-x-1/2 *:before:inset-bs-2 *:before:inset-be-7 *:before:-z-1 *:before:rounded-4xl *:before:shadow-xs *:before:shadow-black *:before:transition-all *:hover:text-zinc-300 *:active:text-zinc-200 sm:inset-be-2 sm:mx-4 sm:rounded-full sm:border-2 sm:text-sm sm:shadow-xl sm:*:before:inset-y-1">
        <LinkProfileConfiguration path="content">
          <IconContent width={ICON_DIMENSION} />
          Content
        </LinkProfileConfiguration>
        <LinkProfileConfiguration path="style">
          <IconStyle width={ICON_DIMENSION} />
          Style
        </LinkProfileConfiguration>
        {/**
         * <LinkProfileConfiguration path="members">
            <IconUsers width={ICON_DIMENSION} />
            Members
          </LinkProfileConfiguration>
         */}
        <LinkProfileConfiguration path="settings">
          <IconSettings width={ICON_DIMENSION} />
          Settings
        </LinkProfileConfiguration>
      </nav>
    </div>
  );
}
