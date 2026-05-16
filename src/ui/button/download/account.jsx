"use client";

import { useState } from "react";
import { alertErrorApp } from "#src/lib/alert";
import IconDownload from "#src/icons/download.svg";
import { requestUser } from "#src/lib/request";
import globalState from "#src/lib/state";
import { updateUserState } from "#src/lib/state/user";
import { msToSeconds } from "#src/lib/time";
import Button from "#src/ui/button";

/**
 * @function ButtonDownloadAccountData
 * @returns {React.ReactNode}
 */
export default function ButtonDownloadAccountData() {
  const [submitting, setSubmitting] = useState(false);

  async function downloadDataOnClick() {
    setSubmitting(true);

    const res = await requestUser();

    if (!res) {
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      return;
    }

    const data = await res.json();

    updateUserState(data);

    globalState.fetched = msToSeconds(Date.now(), Math.ceil);

    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));

    const link = document.createElement("a");

    link.href = url;
    link.download = "user_data.json";
    link.click();

    URL.revokeObjectURL(url);

    setSubmitting(false);
  }

  return (
    <Button type="button" onClick={downloadDataOnClick} disabled={submitting}>
      <IconDownload width="1.25em" />
      Download my data
    </Button>
  );
}
