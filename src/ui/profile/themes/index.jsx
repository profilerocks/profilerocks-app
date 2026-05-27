"use client";

import { useEffect, useId, useState } from "react";
import { useSnapshot } from "valtio";
import IconLoading from "#src/icons/loading.svg";
import { alertErrorApp } from "#src/lib/alert";
import { requestProfileThemes, requestProfileThemeChange } from "#src/lib/request";
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
 * @function ProfileThemePreviewCheck
 * @param {Object} props
 * @param {string} props.publicId
 * @param {boolean} [props.disabled]
 * @returns {React.ReactNode}
 */
function ProfileThemePreviewCheck({ disabled, publicId }) {
  const { currentProfile } = useSnapshot(globalState);
  const inputPreviewCheckboxId = useId();

  const checked = currentProfile?.theme_preview === publicId;

  /**
   * @function setProfileThemePreviewOnChange
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  function setProfileThemePreviewOnChange(event) {
    const { currentProfile } = globalState;

    if (!currentProfile) {
      return;
    }

    const el = event.currentTarget ?? event.target;

    if (el.checked) {
      currentProfile.theme_preview = publicId;
    } else {
      delete currentProfile.theme_preview;
    }
  }

  let labelClassName = styles["profile-theme-preview-label"];

  if (checked) {
    labelClassName += " " + styles["profile-theme-preview-checked"];
  }

  return (
    <>
      <input
        checked={checked}
        disabled={disabled}
        id={inputPreviewCheckboxId}
        onChange={setProfileThemePreviewOnChange}
        type="checkbox"
        hidden
      />
      <label className={labelClassName} htmlFor={inputPreviewCheckboxId}>
        {checked ? "Previewing" : "Preview"}
      </label>
    </>
  )
}

/**
 * @function ProfileTheme
 * @param {ProfileThemeObject & {
 *   onChange: React.ChangeEventHandler<HTMLInputElement,HTMLInputElement>
 *   publicId: string
 *   disabled?: boolean
 * }} props
 * @returns {React.ReactNode}
 */
function ProfileTheme({ background, color, disabled, onChange, publicId, title }) {
  const { currentProfile } = useSnapshot(globalState);
  const inputRadioId = useId();

  const checked = currentProfile?.theme === publicId;
  const htmlTitle = "Select " + title + " theme";

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
      <label className={styles["profile-theme-title"]} htmlFor={inputRadioId} title={htmlTitle}>
        {title}
      </label>
      {!checked && <ProfileThemePreviewCheck disabled={disabled} publicId={publicId} />}
      <input
        checked={checked}
        className={styles["profile-theme-input"]}
        disabled={disabled}
        id={inputRadioId}
        name="profile-theme"
        onChange={onChange}
        title={htmlTitle}
        type="radio"
        value={publicId}
      />
    </li>
  );
}

export default function ProfileThemes() {
  /**
   * @type {ReturnType<typeof useState<Record<string,ProfileThemeObject>>>}
   */
  const [profileThemes, setProfileThemes] = useState();

  const [submitting, setSubmitting] = useState(false);

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
   * @async
   * @function setThemeOnChange
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  async function setThemeOnChange(event) {
    if (submitting) {
      return;
    }

    const currentProfile = globalState.currentProfile;

    if (!currentProfile) {
      return;
    }

    const profilePublicId = currentProfile.public_id;

    const el = event.currentTarget ?? event.target;

    if (!el.checked) {
      return;
    }

    const profileThemePublicId = el.value;

    setSubmitting(true);

    const res = await requestProfileThemeChange(profilePublicId, profileThemePublicId);

    setSubmitting(false);

    if (!res) {
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      return;
    }

    currentProfile.theme = profileThemePublicId;

    delete currentProfile.theme_preview;
  }

  /**
   * @type {React.ReactNode[]}
   */
  const ProfilesThemeList = [];

  for (const profileThemePublicId in profileThemes) {
    const profileTheme = profileThemes[profileThemePublicId];

    if (profileTheme) {
      ProfilesThemeList.push(
        <ProfileTheme
          {...profileThemes[profileThemePublicId]}
          disabled={submitting}
          key={profileThemePublicId}
          onChange={setThemeOnChange}
          publicId={profileThemePublicId}
        />
      );
    }
  }

  if (ProfilesThemeList.length <= 0) {
    return <h2>No themes avaiable</h2>;
  }

  return <ul className={styles["profile-theme-list"]}>{ProfilesThemeList}</ul>;
}
