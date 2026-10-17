"use client";

import { useRouter } from "next/navigation";
import { useDeferredValue, useState } from "react";
import displayNameAttributes from "#shared/display.json";
import { showAlertErrorApp } from "#src/lib/alert";
import { normalizeDisplayName } from "#src/lib/name";
import { requestProfileDisplayNameUpdate } from "#src/lib/request";
import globalState from "#src/lib/state";
import ButtonNext from "#src/ui/button/next";
import InputGroup from "#src/ui/input/group";

/**
 * @function
 * @param {Object} props
 * @param {string} [props.className]
 * @returns {React.ReactNode}
 */
export default function FormProfileDisplayName({ className: customClassName }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [displayName, setDisplayName] = useState(globalState.currentProfile?.display_name ?? "");
  const deferredDisplayName = useDeferredValue(displayName);

  const normalizedDisplayName = normalizeDisplayName(deferredDisplayName);

  const lengthDifference = normalizedDisplayName.length - displayName.length;
  const minLengthDisplayName = lengthDifference + 1;
  const maxLengthDisplayName = lengthDifference + displayNameAttributes.maxLength;

  /**
   * @function setDisplayNameOnChange
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  function setDisplayNameOnChange(event) {
    setDisplayName(event.currentTarget.value);
  }

  /**
   * @async
   * @function submitProfileDisplayName
   * @param {React.SubmitEvent<HTMLFormElement>} event
   */
  async function submitProfileDisplayName(event) {
    event.preventDefault();

    const { currentProfile } = globalState;

    if (!currentProfile) {
      return;
    }

    if (normalizedDisplayName) {
      setSubmitting(true);

      const res = await requestProfileDisplayNameUpdate(currentProfile.public_id, normalizedDisplayName);

      if (!res) {
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        showAlertErrorApp();
        setSubmitting(false);
        return;
      }

      currentProfile.display_name = normalizedDisplayName;
    }

    router.push("/p/content?id=" + currentProfile.public_id);
  }

  return (
    <form className={customClassName} onSubmit={submitProfileDisplayName}>
      <InputGroup
        type="text"
        placeholder="e.g. John Doe"
        minLength={minLengthDisplayName}
        maxLength={maxLengthDisplayName}
        onChange={setDisplayNameOnChange}
        value={displayName}
        disabled={submitting}
      >
        Display name
      </InputGroup>
      <ButtonNext className="float-end mbs-4 ps-3.5" disabled={submitting} type="submit" />
    </form>
  );
}
