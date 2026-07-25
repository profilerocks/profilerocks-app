"use client";

import { useState } from "react";
import { showAlertErrorApp } from "#src/lib/alert";
import IconBin from "#src/icons/bin.svg";
import { requestUserDeletion } from "#src/lib/request";
import { deleteUserState } from "#src/lib/state/user";
import ButtonDanger from "#src/ui/button/danger";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function ButtonDeleteAccount() {
  const stateSubmit = useState(false);
  const [isSubmitting, setIsSubmitting] = stateSubmit;

  async function deleteAccountOnClick(/*event: MouseEventButton*/) {
    if (!confirm("Are you sure you want to delete your account?")) {
      return;
    }

    setIsSubmitting(true);

    const res = await requestUserDeletion();

    if (!res) {
      return;
    }

    deleteUserState();

    if (!res.ok) {
      showAlertErrorApp();
    }
  }

  return (
    <ButtonDanger className="pe-3.5" disabled={isSubmitting} onClick={deleteAccountOnClick}>
      <IconBin width="1.25em" />
      Delete your account
    </ButtonDanger>
  );
}
