"use client";

import { useEffect, useId, useState } from "react";
import { useSnapshot } from "valtio";
import IconLoading from "#src/icons/loading.svg";
import { showAlert, showAlertErrorApp } from "#src/lib/alert";
import { requestProfileThemes, requestProfileThemeChange } from "#src/lib/request";
import globalState from "#src/lib/state";
import { isProfilePremium } from "#src/lib/state/profile";

interface ProfileThemeObject {
  background: string;
  color: string;
  premium: 0 | 1;
  title: string;
}

interface ProfileThemePreviewCheckProps {
  publicId: string;
  disabled?: boolean;
}

function ProfileThemePreviewCheck({ disabled, publicId }: ProfileThemePreviewCheckProps): React.ReactNode {
  const { currentProfile } = useSnapshot(globalState);
  const inputPreviewCheckboxId = useId();

  const checked = currentProfile?.theme_preview === publicId;

  function setProfileThemePreviewOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { currentProfile } = globalState;

    if (!currentProfile) {
      return;
    }

    const el = event.currentTarget ?? event.target;

    if (el.checked) {
      currentProfile.theme_preview = publicId;
      location.hash = "#preview";
    } else {
      currentProfile.theme_preview = undefined;
    }
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
      <label
        className={
          "min-w-24 cursor-pointer rounded-3xl bg-zinc-900 p-2 text-center text-sm transition-colors hover:bg-zinc-800 active:bg-zinc-700 " +
          (checked ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-300 active:text-zinc-200")
        }
        htmlFor={inputPreviewCheckboxId}
      >
        {checked ? "Previewing" : "Preview"}
      </label>
    </>
  );
}

interface ProfileThemeEntryProps extends ProfileThemeObject, ProfileThemePreviewCheckProps {
  onChange: React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
}

function ProfileThemeEntry({ background, color, disabled, onChange, publicId, title }: ProfileThemeEntryProps): React.ReactNode {
  const { currentProfile } = useSnapshot(globalState);
  const inputRadioId = useId();

  const checked = currentProfile?.theme === publicId;
  const htmlTitle = "Select " + title + " theme";

  return (
    <li>
      <label
        className={
          "flex-1 cursor-pointer py-3 text-xl " + (checked ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-300 active:text-zinc-200")
        }
        htmlFor={inputRadioId}
        title={htmlTitle}
      >
        <span className="self me-2 inline-flex h-5.5 border border-zinc-700 align-text-top *:w-3">
          <span style={{ backgroundColor: color }} title="Main color" />
          <span style={{ backgroundColor: background }} title="Background" />
        </span>
        {title}
      </label>
      {!checked && <ProfileThemePreviewCheck disabled={disabled} publicId={publicId} />}
      <input
        checked={checked}
        className="scale-150 cursor-pointer accent-emerald-400 disabled:cursor-not-allowed"
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

interface ProfileThemeListProps {
  children: React.ReactNode;
}

function ProfileThemeList({ children }: ProfileThemeListProps): React.ReactNode {
  return <ul className="mbs-2 select-none *:flex *:items-center *:gap-4 *:border-bs *:border-zinc-700 *:pe-2">{children}</ul>;
}

export default function ProfileThemes() {
  const [profileThemes, setProfileThemes] = useState<Record<string, ProfileThemeObject>>();

  const [submitting, setSubmitting] = useState(false);

  async function getProfileThemes() {
    const res = await requestProfileThemes();

    if (!res) {
      return;
    }

    if (!res.ok) {
      showAlertErrorApp();
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
        <IconLoading width="1.5em" />
        Loading...
      </>
    );
  }

  async function setThemeOnChange(event: React.ChangeEvent<HTMLInputElement>) {
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

    if (
      /**
       * Is theme premium?
       */
      profileThemes?.[profileThemePublicId]?.premium &&
      !isProfilePremium(profilePublicId)
    ) {
      showAlert("Upgrade to a premium profile to use this theme");
      return;
    }

    setSubmitting(true);

    const res = await requestProfileThemeChange(profilePublicId, profileThemePublicId);

    setSubmitting(false);

    if (!res) {
      return;
    }

    if (!res.ok) {
      showAlertErrorApp();
      return;
    }

    currentProfile.theme = profileThemePublicId;

    if (profileThemePublicId !== currentProfile.theme_preview) {
      location.hash = "#preview";
    }

    currentProfile.theme_preview = undefined;
  }

  const profileFreeThemeList: React.ReactNode[] = [];

  const profilePremiumThemeList: React.ReactNode[] = [];

  for (const profileThemePublicId in profileThemes) {
    const profileTheme = profileThemes[profileThemePublicId];

    const profileThemeNode = (
      <ProfileThemeEntry
        {...profileTheme}
        disabled={submitting}
        key={profileThemePublicId}
        onChange={setThemeOnChange}
        publicId={profileThemePublicId}
      />
    );

    if (profileTheme.premium) {
      profilePremiumThemeList.push(profileThemeNode);
    } else {
      profileFreeThemeList.push(profileThemeNode);
    }
  }

  const freeThemesAvailable = profileFreeThemeList.length > 0;

  const premiumThemesAvailable = profilePremiumThemeList.length > 0;

  if (!freeThemesAvailable && !premiumThemesAvailable) {
    return <h2>No themes avaiable</h2>;
  }

  return (
    <>
      {freeThemesAvailable && (
        <>
          <h2 className="text-2xl">Free Themes</h2>
          <ProfileThemeList>{profileFreeThemeList}</ProfileThemeList>
        </>
      )}
      {premiumThemesAvailable && (
        <>
          <h2 className="mbs-5 text-2xl text-yellow-400">Premium Themes</h2>
          <ProfileThemeList>{profilePremiumThemeList}</ProfileThemeList>
        </>
      )}
    </>
  );
}
