"use client";

import { useState } from "react";
import { useSnapshot } from "valtio";
import { alertErrorApp } from "#src/lib/alert";
import IconDownload from "#src/icons/download.svg";
import { requestProfileData } from "#src/lib/request";
import globalState from "#src/lib/state";
import { updateProfileState } from "#src/lib/state/profile";
import { msToSeconds } from "#src/lib/time";
import Button from "#src/ui/button";

/**
 * @function ButtonDownloadProfileData
 * @returns {React.ReactNode}
 */
export default function ButtonDownloadProfileData() {
  const { currentProfile } = useSnapshot(globalState);
  const [submitting, setSubmitting] = useState(false);

  if (!currentProfile) {
    return null;
  }

  async function downloadDataOnClick() {
    if (!currentProfile) {
      return;
    }

    setSubmitting(true);

    const res = await requestProfileData(currentProfile.public_id);

    if (!res) {
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      return;
    }

    const data = await res.json();

    if (!updateProfileState(currentProfile.public_id, data)) {
      alertErrorApp();
      return;
    }

    globalState.fetched = msToSeconds(Date.now(), Math.ceil);

    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));

    const link = document.createElement("a");

    link.href = url;
    link.download = `profile_data_${currentProfile.name_id}.json`;
    link.click();

    URL.revokeObjectURL(url);

    setSubmitting(false);
  }

  return (
    <Button type="button" onClick={downloadDataOnClick} disabled={submitting}>
      <IconDownload width="1.25em" />
      Download profile data
    </Button>
  );
}
