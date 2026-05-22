"use client";

import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import IconLoading from "#src/icons/loading.svg";
import { alertErrorApp } from "#src/lib/alert";
import { requestProfileThemes } from "#src/lib/request";
import globalState from "#src/lib/state";
import styles from "./index.module.scss";

/**
 * @typedef {Object} ProfileThemeObject
 * @prop {string} background - Base64Url encoded
 * @prop {string} color - Base64Url encoded
 * @prop {(0|1)} premium
 * @prop {string} title
 */

/**
 * @function ProfileTheme
 * @param {ProfileThemeObject & {publicId:string}} props
 * @returns {React.ReactNode}
 */
function ProfileTheme({ background, color, premium, publicId, title }) {
  const { currentProfile } = useSnapshot(globalState);

  return (
    <li
      className={styles["profile-theme"]}
      style={{
        // @ts-expect-error
        "--theme-background": "#" + Uint8Array.fromBase64(background, { alphabet: "base64url" }).toHex(),
        // @ts-expect-error
        "--theme-color": "#" + Uint8Array.fromBase64(color, { alphabet: "base64url" }).toHex()
      }}
    >
      <h3 className={styles["profile-theme-title"]}>{title}</h3>
    </li>
  );
}

export default function ProfileThemes() {
  /**
   * @type {ReturnType<typeof useState<Record<string,ProfileThemeObject>>>}
   */
  const [profileThemes, setProfileThemes] = useState();

  async function getProfileThemes() {
    const res = await requestProfileThemes();

    if (!res) {
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      return;
    }

    setProfileThemes(await res.json());
  }

  useEffect(() => {
    getProfileThemes();
  }, []);

  if (!profileThemes) {
    return (
      <>
        <IconLoading width="1.5em" /> Loading...
      </>
    );
  }

  /**
   * @type {React.ReactNode[]}
   */
  const ProfilesThemeList = [];

  for (const profileThemePublicId in profileThemes) {
    const profileTheme = profileThemes[profileThemePublicId];

    if (profileTheme) {
      ProfilesThemeList.push(
        <ProfileTheme key={profileThemePublicId} publicId={profileThemePublicId} {...profileThemes[profileThemePublicId]} />
      );
    }
  }

  if (ProfilesThemeList.length <= 0) {
    return <h2>No themes avaiable</h2>;
  }

  return <ul className={styles["profile-theme-list"]}>{ProfilesThemeList}</ul>;
}
