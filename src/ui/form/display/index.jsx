"use client";

import { useRouter } from "next/navigation";
import { useState, useDeferredValue } from "react";
import { alertErrorApp } from "#src/lib/alert";
import { normalizeDisplayName } from "#src/lib/name";
import { requestUserDisplayNameUpdate } from "#src/lib/request";
import globalState from "#src/lib/state";
import displayNameAttributes from "#shared/display.json";
import InputGroup from "#src/ui/input/group";
import LinkBack from "#src/ui/link/back";
import Actions from "#src/ui/actions";
import Requirements from "#src/ui/requirements";
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
  const inputMinLength = lengthDifference + displayNameAttributes.minLength;
  const inputMaxLength = lengthDifference + displayNameAttributes.maxLength;
  const invalidNormalizedName =
    normalizedDisplayName.length < displayNameAttributes.minLength || normalizedDisplayName === globalState.displayName;
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
      alertErrorApp();
      setIsSubmitting(false);
      return;
    }

    globalState.displayName = normalizedDisplayName;

    const nextHref = globalState.redirect || hrefNext;

    if (nextHref) {
      router.push(nextHref);
      delete globalState.redirect;
    } else {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={sendNameToServer}>
      <InputGroup
        type="text"
        placeholder="e.g. John Doe"
        defaultValue={globalState.displayName}
        minLength={inputMinLength}
        maxLength={inputMaxLength}
        onChange={setDisplayNameOnInput}
        disabled={isSubmitting}
        required
      >
        Name
      </InputGroup>
      <Requirements>
        <li className={invalidNormalizedName ? undefined : "valid"}>
          Between {displayNameAttributes.minLength} & {displayNameAttributes.maxLength} characters
        </li>
      </Requirements>
      <Actions>
        {hrefBack && <LinkBack href={hrefBack}>Back</LinkBack>}
        <Button type="submit" disabled={disabled}>
          {children}
        </Button>
      </Actions>
    </form>
  );
}
