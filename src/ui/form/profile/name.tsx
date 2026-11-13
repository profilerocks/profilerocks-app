"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useId, useState } from "react";
import { useSnapshot } from "valtio";
import profileAttributes from "#shared/profile.json";
import IconArrowRight from "#src/icons/arrow/right.svg";
import IconPencil from "#src/icons/pencil.svg";
import { showAlertErrorApp, showAlert } from "#src/lib/alert";
import { updateProfileState } from "#src/lib/state/profile";
import forbiddenProfileNames from "#src/lib/profile/forbidden";
import { regexProfile } from "#src/lib/regex";
import { requestProfileCreation, requestProfileNameIdUpdate } from "#src/lib/request";
import globalState from "#src/lib/state";
import Button from "#src/ui/button";
import DateTime from "#src/ui/date/time";
import Link from "#src/ui/link";
import Message from "#src/ui/message";

export type RequestFunction = (nameId: string) => Promise<Response | undefined>;

export type OnSuccessFunction = (res: Response, nameId: string) => Promise<boolean>;

const NAME_ID_UPDATE_GAP_DAYS = Math.ceil(profileAttributes.nameIdUpdateGapMs / 86400000);

export interface FormProfileNameIdProps {
  children: React.ReactNode;
  defaultValue?: string;
  disabled?: boolean;
  onSuccess: OnSuccessFunction;
  requestFunction: RequestFunction;
  submitTitle?: string;
}

export default function FormProfileNameId({
  children,
  defaultValue = "",
  disabled,
  onSuccess,
  requestFunction,
  submitTitle
}: FormProfileNameIdProps): React.ReactNode {
  const [nameId, setNameId] = useState(defaultValue);
  const [submitting, setSubmitting] = useState(false);
  const [unique, setUnique] = useState<boolean | undefined>(undefined);

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
  }, [defaultValue]);

  useEffect(() => {
    if (dirty) {
      /**
       * "Are you sure you want to leave this page?" warning if the user tries to reload or close the tab.
       */
      function handleBeforeUnload(event: BeforeUnloadEvent): void {
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

  function setNameOnInput(event: React.ChangeEvent<HTMLInputElement>): void {
    setNameId(event.currentTarget.value.trim().toLowerCase());
    setUnique(undefined);
  }

  async function submitProfileName(event: React.FormEvent<HTMLFormElement>): Promise<void> {
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
      showAlert("Try another name.");
      setUnique(false);
      setSubmitting(false);
      return;
    }

    if (!res.ok) {
      showAlertErrorApp();
      setUnique(undefined);
      setSubmitting(false);
      return;
    }

    if (await onSuccess(res, deferredNameId)) {
      setUnique(true);
    } else {
      showAlertErrorApp();
      setUnique(undefined);
      setSubmitting(false);
    }
  }

  return (
    <form autoComplete="off" onSubmit={submitProfileName} title={disabled ? "Not allowed to change the profile name." : undefined}>
      <div className="mx-auto flex max-w-3xl rounded-xl border-2 border-zinc-700 text-lg transition-colors focus-within:border-emerald-400 sm:text-xl sm:rounded-2xl">
        <label className="cursor-text py-2.25 ps-2.75 text-zinc-400 sm:py-3 sm:ps-4 sm:py-3.25 select-none" htmlFor={inputId}>
          profile.rocks/
        </label>
        <input
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="min-w-0 flex-1 caret-emerald-400 outline-hidden placeholder:text-zinc-500"
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
        <Button className="mx-1 self-center sm:mx-2" disabled={!nameIdValid || inputDisabled} title={submitTitle} type="submit">
          {children}
        </Button>
      </div>
      <ul className="mx-auto mbs-4 max-w-max space-y-2 text-sm text-zinc-400 *:transition-colors sm:text-base">
        <li className={nameIdFormatCorrect ? "text-green-400" : nameIdFormatCorrect === false ? "text-rose-400" : undefined}>
          Latin letters, numbers & embedded underscores
        </li>
        <li className={nameIdLengthCorrect ? "text-green-400" : undefined}>
          Between {profileAttributes.minLength} & {profileAttributes.maxLength} characters
        </li>
        <li className={nameIdBlacklisted ? "text-rose-400" : nameIdBlacklisted === false ? "text-green-400" : undefined}>
          <span>
            It is not{" "}
            <Link href="/i/blacklist" target="_blank" rel="noopener noreferrer">
              blacklisted
            </Link>
          </span>
        </li>
        <li className={unique ? "text-green-400" : submitting ? "animate-pulse" : unique === false ? "text-rose-400" : undefined}>
          Must be unique
        </li>
      </ul>
    </form>
  );
}

export function FormProfileNameIdPageWrapper(): React.ReactNode {
  const router = useRouter();
  const { profiles } = useSnapshot(globalState);
  const allowed = !profiles?.length || profiles.length < profileAttributes.limit;

  useEffect(() => {
    if (!allowed) {
      router.push("/");
    }
  }, [allowed, router]);

  async function moveToSetupPageOnSuccess(res: Response, nameId: string): Promise<boolean> {
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
    <FormProfileNameId onSuccess={moveToSetupPageOnSuccess} requestFunction={requestProfileCreation} submitTitle="Next">
      <IconArrowRight width="1em" />
    </FormProfileNameId>
  ) : (
    <Message>Redirecting...</Message>
  );
}

export function FormProfileNameIdUpdate(): React.ReactNode {
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

  async function onSuccess(_res: Response, nameId: string): Promise<boolean> {
    if (!currentProfile) {
      return false;
    }

    return updateProfileState(currentProfile.public_id, { name_id: nameId, name_id_updated_at: Math.ceil(Date.now() / 1000) });
  }

  async function requestFunction(nameId: string): Promise<Response | undefined> {
    if (currentProfile) {
      return await requestProfileNameIdUpdate(currentProfile.public_id, nameId);
    }
  }

  return (
    <>
      {nameIdUpdateAt && (
        <p className="mbs-2 text-xs text-zinc-500">
          Last update: <DateTime dateTime={nameIdUpdateAt} />
        </p>
      )}
      <p className="my-4 text-zinc-400">
        <strong className="text-zinc-300">You are {disabled && "not currently "}allowed to change the profile name</strong>. It is only
        allowed once every {NAME_ID_UPDATE_GAP_DAYS} days.
      </p>
      <FormProfileNameId
        defaultValue={currentProfile.name_id}
        disabled={disabled}
        onSuccess={onSuccess}
        requestFunction={requestFunction}
        submitTitle="Save"
      >
        <span className="hidden sm:inline-block">Save</span>
        <IconPencil width="1.125em" />
      </FormProfileNameId>
    </>
  );
}
