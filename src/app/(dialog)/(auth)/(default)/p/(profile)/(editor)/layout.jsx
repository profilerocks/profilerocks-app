"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSnapshot } from "valtio";
import { showAlertErrorApp } from "#src/lib/alert";
import { HREF_ASSETS } from "#src/lib/env";
import { requestProfileData } from "#src/lib/request";
import globalState from "#src/lib/state";
import { updateProfileState } from "#src/lib/state/profile";
import LinkPillSolid from "#src/ui/link/pill/solid";
import IconContent from "#src/icons/content.svg";
import IconPencil from "#src/icons/pencil.svg";
import IconStyle from "#src/icons/style.svg";
import IconUsers from "#src/icons/user/multiple.svg";
import IconSettings from "#src/icons/settings.svg";
import styles from "./layout.module.scss";

const ICON_DIMENSION = "1.75em";
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
          className={styles["profile-photo"]}
          height="50"
          src={currentProfile.photo ? HREF_ASSETS + "/profile/" + currentProfile.public_id + "/photo" : "/user.png"}
          width="50"
        />
      </Link>
      <figcaption className={styles["figcaption-profile"]}>
        <div className={styles["profile-info"]}>
          <Link className={styles["anchor-profile-display-name"]} href={href} title={TITLE_EDIT_PROFILE_HEADER}>
            {currentProfile.display_name || currentProfile.name_id}
          </Link>
          <p className={styles["profile-name-id"]} title={currentProfile.name_id}>
            {currentProfile.name_id}
          </p>
        </div>
        <LinkPillSolid className={styles["profile-header-edit-link"]} href={href} title={TITLE_EDIT_PROFILE_HEADER}>
          <IconPencil className={styles["profile-header-edit-icon"]} />
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
 * @param {string} props.title
 */
function LinkProfileConfiguration({ children, path, title }) {
  const { currentProfile } = useSnapshot(globalState);
  const pathname = usePathname();

  if (!currentProfile) {
    return null;
  }

  let active = pathname.includes(path);

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={active ? styles.active : undefined}
      href={"/p/" + path + "?id=" + currentProfile.public_id + "#page"}
      title={title}
    >
      {children}
      <span>{title}</span>
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
    <div className={styles["container-profile-configuration"]}>
      <figure className={styles["figure-profile"]}>
        <FigureProfileContent />
      </figure>
      <div className={styles["container-content"]}>{loading ? "Loading..." : children}</div>
      <menu className={styles["profile-menu"]}>
        <li>
          <LinkProfileConfiguration path="content" title="Content">
            <IconContent width={ICON_DIMENSION} />
          </LinkProfileConfiguration>
        </li>
        <li>
          <LinkProfileConfiguration path="style" title="Style">
            <IconStyle width={ICON_DIMENSION} />
          </LinkProfileConfiguration>
        </li>
        {/**<li>
          <LinkProfileConfiguration path="members" title="Members">
            <IconUsers width={ICON_DIMENSION} />
          </LinkProfileConfiguration>
        </li> */}
        <li>
          <LinkProfileConfiguration path="settings" title="Settings">
            <IconSettings width={ICON_DIMENSION} />
          </LinkProfileConfiguration>
        </li>
      </menu>
    </div>
  );
}
