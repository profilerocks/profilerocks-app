"use client";

import { useState } from "react";
import { useSnapshot } from "valtio";
import IconBin from "#src/icons/bin.svg";
import { alertErrorApp } from "#src/lib/alert";
import { useProfileActivePremium } from "#src/lib/hooks/state";
import { requestProfileMembershipDelete } from "#src/lib/request";
import globalState from "#src/lib/state";
import { deleteProfileState } from "#src/lib/state/profile";
import ButtonDanger from "#src/ui/button/danger";
import styles from "./index.module.scss";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function ButtonDeleteProfileMembership() {
  const [submitting, setSubmitting] = useState(false);
  const { currentProfile } = useSnapshot(globalState);
  const premiumActive = useProfileActivePremium();

  if (!currentProfile) {
    return null;
  }

  async function deleteProfile() {
    if (!currentProfile) {
      return;
    }

    let confirmText = `Are you sure you want to delete ${currentProfile.name_id} profile?`;

    /**
     * TODO: Only add this message if the subscription is managed by the user and not other member.
     */
    if (premiumActive) {
      confirmText +=
        " " +
        (currentProfile.premium?.subscription_status
          ? "Your subscription will be permanently cancelled."
          : "Remember this is a premium profile and this process is not recoverable.");
    }

    if (!confirm(confirmText)) {
      return;
    }

    setSubmitting(true);

    /**
     * Store `profilePublicId` in a varaible to avoid `currentProfile` issues.
     */
    const profilePublicId = currentProfile.public_id;

    const res = await requestProfileMembershipDelete(profilePublicId);

    setSubmitting(false);

    if (!res) {
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      return;
    }

    deleteProfileState(profilePublicId);
  }

  return (
    <ButtonDanger className={styles["btn-delete-profile"]} disabled={submitting} onClick={deleteProfile} type="button">
      <IconBin width="1.375em" />
      Delete profile
    </ButtonDanger>
  );
}
