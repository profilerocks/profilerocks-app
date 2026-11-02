"use client";

import type React from "react";
import { useState } from "react";
import { showAlertErrorApp } from "#src/lib/alert";
import IconBin from "#src/icons/bin.svg";
import { requestUserDeletion } from "#src/lib/request";
import { deleteUserState } from "#src/lib/state/user";
import ButtonDanger from "#src/ui/button/danger";

export default function ButtonDeleteAccount(): React.ReactNode {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function deleteAccountOnClick(): Promise<void> {
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
