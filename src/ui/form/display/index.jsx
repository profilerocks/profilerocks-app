"use client";

import { useRouter } from "next/navigation";
import { useState, useDeferredValue } from "react";
import { showAlertErrorApp } from "#src/lib/alert";
import { normalizeDisplayName } from "#src/lib/name";
import { requestUserDisplayNameUpdate } from "#src/lib/request";
import globalState from "#src/lib/state";
import displayAttributes from "#shared/display.json";
import InputGroup from "#src/ui/input/group";
import LinkBack from "#src/ui/link/back";
import Button from "#src/ui/button";

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.hrefBack]
 * @param {string} [props.hrefNext]
 * @returns {React.ReactNode}
 */
export default function FormDisplayName({ children, hrefBack, hrefNext }) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [displayName, setDisplayName] = useState("");

  const deferredDisplayName = useDeferredValue(displayName);

  const normalizedDisplayName = normalizeDisplayName(deferredDisplayName);

  const lengthDifference = displayName.length - normalizedDisplayName.length;

  const invalidNormalizedName =
    normalizedDisplayName.length < displayAttributes.minLength || normalizedDisplayName === globalState.displayName;

  const disabled = isSubmitting || invalidNormalizedName;

  /**
   * @function setDisplayNameOnInput
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  function setDisplayNameOnInput(event) {
    setDisplayName(event.currentTarget.value);
  }

  /**
   * @async
   * @function sendNameToServer
   * @param {React.SubmitEvent<HTMLFormElement>} event
   */
  async function sendNameToServer(event) {
    event.preventDefault();

    if (disabled) {
      return;
    }

    setIsSubmitting(true);

    const res = await requestUserDisplayNameUpdate(normalizedDisplayName);

    if (!res) {
      setIsSubmitting(false);
      return;
    }

    if (!res.ok) {
      showAlertErrorApp();
      setIsSubmitting(false);
      return;
    }

    globalState.displayName = normalizedDisplayName;

    if (hrefNext) {
      router.push(hrefNext);
    } else {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={sendNameToServer}>
      <InputGroup
        defaultValue={globalState.displayName}
        disabled={isSubmitting}
        maxLength={lengthDifference + displayAttributes.maxLength}
        minLength={lengthDifference + displayAttributes.minLength}
        onChange={setDisplayNameOnInput}
        placeholder="e.g. John Doe"
        required
        type="text"
      >
        Name
      </InputGroup>
      <p className={"ms-2 mbs-2 text-sm transition-colors " + (invalidNormalizedName ? "text-zinc-400" : "text-green-400")}>
        Between {displayAttributes.minLength} & {displayAttributes.maxLength} characters
      </p>
      <div className="mbs-5 flex justify-between">
        {hrefBack && (
          <LinkBack className="pe-3.5" href={hrefBack}>
            Back
          </LinkBack>
        )}
        <Button className={hrefBack ? "ps-3.5" : "w-full"} disabled={disabled} type="submit">
          {children}
        </Button>
      </div>
    </form>
  );
}
