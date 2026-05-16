"use client";

import { useId } from "react";
import { useSnapshot } from "valtio";
import { alertErrorApp } from "#src/lib/alert";
import { PLATFORM_NAME } from "#src/lib/env";
import { useProfileActivePremium } from "#src/lib/hooks/state";
import { requestProfileWatermarkToggle } from "#src/lib/request";
import globalState from "#src/lib/state";
import { updateProfileState } from "#src/lib/state/profile";
import styles from "./index.module.scss";

export default function ProfileWatermark() {
  const { currentProfile } = useSnapshot(globalState);
  const inputId = useId();
  const premiumActive = useProfileActivePremium();

  if (!currentProfile) {
    return null;
  }

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  async function updateWatermarkStatusOnChange(event) {
    if (!currentProfile?.public_id) {
      return;
    }

    const el = event.currentTarget || event.target;

    const watermark = !el.checked;

    el.disabled = true;

    const res = await requestProfileWatermarkToggle(currentProfile.public_id, watermark);

    el.disabled = false;

    if (!res) {
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      return;
    }

    updateProfileState(currentProfile.public_id, { watermark });
  }

  return (
    <div
      className={
        styles["container-watermark"] +
        " " +
        (premiumActive ? styles["container-watermark-enabled"] : styles["container-watermark-disabled"])
      }
    >
      <input
        checked={premiumActive ? !currentProfile.watermark : false}
        className={styles["checkbox-watermark"]}
        disabled={!premiumActive}
        id={inputId}
        onChange={updateWatermarkStatusOnChange}
        type="checkbox"
      />
      <label className={styles["label-watermark"]} htmlFor={inputId}>
        Hide <strong>{PLATFORM_NAME}</strong> watermark
      </label>
    </div>
  );
}
