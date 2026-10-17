"use client";

import { useDeferredValue, useState } from "react";
import { showAlertErrorApp } from "#src/lib/alert";
import { useProfileActivePremium } from "#src/lib/hooks/state";
import globalState from "#src/lib/state";
import { requestProfileMetaDescriptionUpdate } from "#src/lib/request";
import Button from "#src/ui/button";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function FormProfileMetaDescription() {
  const [submitting, setSubmitting] = useState(false);
  const [metaDescription, setMetaDescription] = useState(globalState.currentProfile?.meta_description ?? "");
  const deferredMetaDescription = useDeferredValue(metaDescription);
  const premiumActive = useProfileActivePremium();
  const normalizedMetaDescription = deferredMetaDescription.trim();
  const lengthDifference = normalizedMetaDescription.length - metaDescription.length;
  const minLengthMetaDescription = lengthDifference + 0;
  const maxLengthMetaDescription = lengthDifference + 255;

  /**
   * @function setMetaDescriptionOnChange
   * @param {React.ChangeEvent<HTMLTextAreaElement>} event
   */
  function setMetaDescriptionOnChange(event) {
    setMetaDescription(event.currentTarget.value);
  }

  /**
   * @async
   * @function submitProfileMetaDescription
   * @param {React.SubmitEvent<HTMLFormElement>} event
   */
  async function submitProfileMetaDescription(event) {
    event.preventDefault();

    const { currentProfile } = globalState;

    if (!currentProfile) {
      return;
    }

    setSubmitting(true);

    const res = await requestProfileMetaDescriptionUpdate(currentProfile.public_id, normalizedMetaDescription);

    setSubmitting(false);

    if (!res) {
      return;
    }

    if (!res.ok) {
      showAlertErrorApp();
      return;
    }

    currentProfile.meta_description = normalizedMetaDescription;
  }

  return (
    <form onSubmit={submitProfileMetaDescription} title={premiumActive ? undefined : "Meta description custom is premium feature."}>
      <textarea
        className="my-5 block w-full cursor-not-allowed resize-none rounded-lg border-2 border-zinc-700 bg-zinc-900 p-2 transition-colors focus:border-emerald-400 disabled:bg-zinc-950"
        disabled={!premiumActive || submitting}
        maxLength={maxLengthMetaDescription}
        minLength={minLengthMetaDescription}
        onChange={setMetaDescriptionOnChange}
        placeholder="e.g. John Doe | Page"
        rows={2}
        value={metaDescription}
      />
      <Button
        type="submit"
        disabled={!premiumActive || submitting || (globalState.currentProfile?.meta_description ?? "") === normalizedMetaDescription}
        className="float-right px-3.5"
      >
        Save meta description
      </Button>
    </form>
  );
}
