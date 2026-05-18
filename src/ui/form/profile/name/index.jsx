"use client";

import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useId, useState } from "react";
import { useSnapshot } from "valtio";
import profileAttributes from "#shared/profile.json";
import IconArrowRight from "#src/icons/arrow/right.svg";
import IconPencil from "#src/icons/pencil.svg";
import { alertErrorApp, alertMessage } from "#src/lib/alert";
import { updateProfileState } from "#src/lib/state/profile";
import forbiddenProfileNames from "#src/lib/profile/forbidden";
import { regexProfile } from "#src/lib/regex";
import { requestProfileCreation, requestProfileNameIdUpdate } from "#src/lib/request";
import globalState from "#src/lib/state";
import Button from "#src/ui/button";
import DateTime from "#src/ui/date";
import Message from "#src/ui/message";
import Requirements from "#src/ui/requirements";
import styles from "./index.module.scss";

/**
 * @callback RequestFunction
 * @param {string} nameId
 * @returns {Promise<Response|undefined>}
 */

/**
 * @callback OnSuccessFunction
 * @param {Response} res
 * @param {string} nameId
 * @returns {Promise<boolean>}
 */

const NAME_ID_UPDATE_GAP_DAYS = Math.ceil(profileAttributes.nameIdUpdateGapMs / 86400000);

/**
 * @function FormProfileNameId
 * @param {Object} params
 * @param {React.ReactNode} params.children
 * @param {OnSuccessFunction} params.onSuccess
 * @param {RequestFunction} params.requestFunction
 * @param {string} [params.boxClassName]
 * @param {string} [params.defaultValue]
 * @param {boolean} [params.disabled]
 * @param {string} [params.requirementsClassName]
 * @param {string} [params.submitTitle]
 * @returns {React.ReactNode}
 */
export default function FormProfileNameId({
  boxClassName: customBoxClassName,
  children,
  defaultValue = "",
  disabled,
  onSuccess,
  requestFunction,
  requirementsClassName,
  submitTitle
}) {
  const [nameId, setNameId] = useState(defaultValue);
  const [submitting, setSubmitting] = useState(false);

  /**
   * @type {ReturnType<typeof useState<boolean>>}
   */
  const [unique, setUnique] = useState();

  const deferredNameId = useDeferredValue(nameId);
  const dirty = deferredNameId ? deferredNameId !== defaultValue : false;
  const inputDisabled = disabled || submitting;
  const inputId = useId();
  const nameIdFormatCorrect = dirty ? regexProfile.test(deferredNameId) : undefined;
  const nameIdLengthCorrect = dirty && deferredNameId.length >= profileAttributes.minLength;
  const nameIdCorrect = nameIdFormatCorrect && nameIdLengthCorrect;
  const nameIdBlacklisted = nameIdCorrect && forbiddenProfileNames.has(deferredNameId);
  const nameIdValid = nameIdCorrect && !nameIdBlacklisted;

  useEffect(() => {
    if (!defaultValue && location.search) {
      const claim = new URLSearchParams(location.search).get("claim");

      if (claim && regexProfile.test(claim) && !forbiddenProfileNames.has(claim)) {
        setNameId(claim.substring(0, profileAttributes.maxLength));
        location.hash = "#page";
      }
    }
  }, []);

  useEffect(() => {
    if (dirty) {
      /**
       * "Are you sure you want to leave this page?" warning if the user tries to reload or close the tab.
       *
       * @function handleBeforeUnload
       * @param {BeforeUnloadEvent} event
       */
      function handleBeforeUnload(event) {
        event.preventDefault();

        /**
         * Required by Chrome.
         */
        event.returnValue = "";
      }

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [dirty]);

  /**
   * @function setNameOnInput
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  function setNameOnInput(event) {
    setNameId(event.currentTarget.value.trim().toLowerCase());
    setUnique(undefined);
  }

  /**
   * @async
   * @function setNameOnInput
   * @param {React.SubmitEvent<HTMLFormElement>} event
   */
  async function submitProfileName(event) {
    event.preventDefault();

    if (!nameIdValid) {
      return;
    }

    setSubmitting(true);

    const res = await requestFunction(deferredNameId);

    if (!res) {
      setSubmitting(false);
      return;
    }

    if (res.status === 409) {
      alertMessage("Try another name.");
      setUnique(false);
      setSubmitting(false);
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      setUnique(undefined);
      setSubmitting(false);
      return;
    }

    if (await onSuccess(res, deferredNameId)) {
      setUnique(true);
    } else {
      alertErrorApp();
      setUnique(undefined);
      setSubmitting(false);
    }
  }

  let boxClassName = styles["box-profile-name-id"];

  if (customBoxClassName) {
    boxClassName += " " + customBoxClassName;
  }

  return (
    <form autoComplete="off" onSubmit={submitProfileName} title={disabled ? "Not allowed to change the profile name." : undefined}>
      <div className={boxClassName}>
        <label htmlFor={inputId}>profile.rocks/</label>
        <input
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          disabled={inputDisabled}
          id={inputId}
          minLength={profileAttributes.minLength}
          maxLength={profileAttributes.maxLength}
          name="profile-name"
          onChange={setNameOnInput}
          pattern={profileAttributes.regex}
          placeholder="name"
          spellCheck={false}
          value={nameId}
          type="text"
        />
        <Button type="submit" disabled={!nameIdValid || inputDisabled} title={submitTitle}>
          {children}
        </Button>
      </div>
      <Requirements className={requirementsClassName}>
        <li className={nameIdFormatCorrect === true ? "valid" : nameIdFormatCorrect === false ? "invalid" : undefined}>
          Latin letters, numbers & embedded underscores
        </li>
        <li className={nameIdLengthCorrect ? "valid" : undefined}>
          Between {profileAttributes.minLength} & {profileAttributes.maxLength} characters
        </li>
        <li className={nameIdBlacklisted ? "invalid" : nameIdBlacklisted === false ? "valid" : undefined}>
          <span>
            It is not{" "}
            <a href="/i/blacklist" target="_blank" rel="noopener noreferrer">
              blacklisted
            </a>
          </span>
        </li>
        <li className={unique ? "valid" : submitting ? "loading" : unique === false ? "invalid" : undefined}>Must be unique</li>
      </Requirements>
    </form>
  );
}

/**
 * @function FormProfileNameIdPageWrapper
 * @returns {React.ReactNode}
 */
export function FormProfileNameIdPageWrapper() {
  const router = useRouter();
  const { profiles } = useSnapshot(globalState);
  const allowed = !profiles?.length || profiles.length < profileAttributes.limit;

  useEffect(() => {
    if (!allowed) {
      router.push("/");
    }
  }, [allowed]);

  /**
   * @type {OnSuccessFunction}
   */
  async function moveToSetupPageOnSuccess(res, nameId) {
    const publicId = await res.text();

    if (!publicId) {
      return false;
    }

    globalState.profiles ??= [];

    globalState.profiles.push({
      public_id: publicId,
      name_id: nameId,
      created_at: Math.ceil(Date.now() / 86400000)
    });

    router.push("/p/setup/header?id=" + publicId + "#page");

    return true;
  }

  return allowed ? (
    <FormProfileNameId
      boxClassName={styles["box-profile-name-id-page"]}
      onSuccess={moveToSetupPageOnSuccess}
      requestFunction={requestProfileCreation}
      requirementsClassName={styles["requirements-box-profile-name-id"]}
      submitTitle="Next"
    >
      <IconArrowRight width="1em" />
    </FormProfileNameId>
  ) : (
    <Message>Redirecting...</Message>
  );
}

export function FormProfileNameIdUpdate() {
  const { currentProfile } = useSnapshot(globalState);
  const [disabled, setDisabled] = useState(true);

  /**
   * `name_id_updated_at` precision is set to seconds and `created_at` to days.
   */
  const nameIdUpdateAt = currentProfile?.name_id_updated_at
    ? currentProfile.name_id_updated_at * 1000
    : currentProfile?.created_at && currentProfile.created_at * 86400000;

  useEffect(() => {
    if (!nameIdUpdateAt) {
      return;
    }

    const remainingMs = profileAttributes.nameIdUpdateGapMs - Date.now() + nameIdUpdateAt;

    if (remainingMs <= 0) {
      setDisabled(false);
      return;
    }

    setDisabled(true);

    const timer = setTimeout(() => {
      setDisabled(false);
    }, remainingMs);

    return () => clearTimeout(timer);
  }, [nameIdUpdateAt]);

  if (!currentProfile) {
    return null;
  }

  /**
   * @type {OnSuccessFunction}
   */
  async function onSuccess(_res, nameId) {
    if (!currentProfile) {
      return false;
    }

    return updateProfileState(currentProfile.public_id, { name_id: nameId, name_id_updated_at: Math.ceil(Date.now() / 1000) });
  }

  /**
   * @type {RequestFunction}
   */
  async function requestFunction(nameId) {
    if (currentProfile) {
      return await requestProfileNameIdUpdate(currentProfile.public_id, nameId);
    }
  }

  return (
    <>
      {nameIdUpdateAt && (
        <p className={styles["profile-name-id-update-date"]}>
          Last update: <DateTime dateTime={nameIdUpdateAt} />
        </p>
      )}
      <p>
        <strong>You are {disabled && "not currently "}allowed to change the profile name</strong>. It is only allowed once every{" "}
        {NAME_ID_UPDATE_GAP_DAYS} days.
      </p>
      <FormProfileNameId
        boxClassName={styles["box-profile-name-id-update"]}
        defaultValue={currentProfile.name_id}
        disabled={disabled}
        onSuccess={onSuccess}
        requestFunction={requestFunction}
        submitTitle="Save"
      >
        <span className={styles["btn-text-profile-name-id"]}>Save</span>
        <IconPencil width="1.125em" />
      </FormProfileNameId>
    </>
  );
}
