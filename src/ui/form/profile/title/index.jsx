"use client";

import { useDeferredValue, useState } from "react";
import { alertErrorApp } from "#src/lib/alert";
import { useProfileActivePremium } from "#src/lib/hooks/state";
import { normalizeDisplayName } from "#src/lib/name";
import globalState from "#src/lib/state";
import { requestProfileTitleUpdate } from "#src/lib/request";
import Button from "#src/ui/button";
import InputGroup from "#src/ui/input/group";
import styles from "./index.module.scss";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function FormProfileTitle() {
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState(globalState.currentProfile?.title ?? "");
  const deferredTitle = useDeferredValue(title);
  const premiumActive = useProfileActivePremium();
  const normalizedTitle = normalizeDisplayName(deferredTitle);
  const lengthDifference = normalizedTitle.length - title.length;
  const minLengthTitle = lengthDifference + 0;
  const maxLengthTitle = lengthDifference + 255;

  /**
   * @function setTitleOnChange
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  function setTitleOnChange(event) {
    setTitle(event.currentTarget.value);
  }

  /**
   * @async
   * @function submitProfileTitle
   * @param {React.SubmitEvent<HTMLFormElement>} event
   */
  async function submitProfileTitle(event) {
    event.preventDefault();

    const { currentProfile } = globalState;

    if (!currentProfile) {
      return;
    }

    setSubmitting(true);

    const res = await requestProfileTitleUpdate(currentProfile.public_id, normalizedTitle);

    setSubmitting(false);

    if (!res) {
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      return;
    }

    currentProfile.title = normalizedTitle;
  }

  return (
    <form onSubmit={submitProfileTitle} title={premiumActive ? undefined : "Title custom is premium feature."}>
      <InputGroup
        type="text"
        placeholder="e.g. John Doe | Page"
        minLength={minLengthTitle}
        maxLength={maxLengthTitle}
        onChange={setTitleOnChange}
        value={title}
        disabled={!premiumActive || submitting}
      >
        Custom Title
      </InputGroup>
      <Button
        type="submit"
        disabled={!premiumActive || submitting || (globalState.currentProfile?.title ?? "") === normalizedTitle}
        className={styles["btn-submit"]}
      >
        Save custom title
      </Button>
    </form>
  );
}
