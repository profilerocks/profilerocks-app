"use client";

import type React from "react";
import { useState } from "react";
import { useSnapshot } from "valtio";
import { showAlertErrorApp, showAlertErrorServer } from "#src/lib/alert";
import { requestOauthDelete, requestOauthLink } from "#src/lib/request";
import globalState from "#src/lib/state";
import { secondsToMs } from "#src/lib/time";
import Button from "#src/ui/button";
import ButtonDanger from "#src/ui/button/danger";

interface ButtonUnlinkProps {
  provider: string;
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

function ButtonUnlink({ provider, submitting, setSubmitting }: ButtonUnlinkProps): React.ReactNode {
  async function unlinkOauthOnClick(): Promise<void> {
    if (!confirm(`Are you sure you want to unlink your ${provider[0].toUpperCase() + provider.substring(1).toLowerCase()} account?`)) {
      return;
    }

    if (!globalState.oauth?.[provider]) {
      showAlertErrorApp();
      return;
    }

    setSubmitting(true);

    const res = await requestOauthDelete(provider);

    if (!res) {
      return;
    }

    if (!res.ok) {
      showAlertErrorApp();
      return;
    }

    if (globalState.oauth[provider]) {
      globalState.oauth[provider] = undefined;
    }

    setSubmitting(false);
  }

  return (
    <ButtonDanger disabled={submitting} onClick={unlinkOauthOnClick} type="button">
      Unlink
    </ButtonDanger>
  );
}

export interface SettingsOauthProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  provider: string;
}

export default function SettingsOauth({ Icon, provider }: SettingsOauthProps): React.ReactNode {
  const { oauth } = useSnapshot(globalState);
  const [submitting, setSubmitting] = useState(false);

  const linked = oauth?.[provider] ? new Date(secondsToMs(oauth[provider])) : undefined;

  async function linkOauthOnClick(): Promise<void> {
    if (
      linked &&
      !confirm(`Are you sure you want to change your ${provider[0].toUpperCase() + provider.substring(1).toLowerCase()} account?`)
    ) {
      return;
    }

    setSubmitting(true);

    const res = await requestOauthLink(provider, true);

    if (!res) {
      return;
    }

    if (!res.ok) {
      showAlertErrorApp();
      setSubmitting(false);
      return;
    }

    const href = await res.text();

    if (!href) {
      showAlertErrorServer();
      setSubmitting(false);
      return;
    }

    window.location.href = href;
  }

  return (
    <article className={"overflow-hidden rounded-2xl border-2 " + (linked ? "border-emerald-400" : "border-zinc-700")}>
      <div className="flex border-be-2 border-zinc-700 bg-zinc-950 p-4">
        <Icon className="drop-shadow-xs drop-shadow-black" width="2.5em" />
        <hgroup className="ms-5">
          <h2 className="text-xl">{provider[0].toUpperCase() + provider.substring(1).toLowerCase()}</h2>
          <p className="text-sm text-zinc-400">
            {linked ? (
              <>
                Linked on <time dateTime={linked.toISOString().split("T")[0]}>{linked.toDateString()}</time>
              </>
            ) : (
              "Not linked"
            )}
          </p>
        </hgroup>
      </div>
      <div className="flex justify-between gap-4 p-4 *:px-4">
        <Button disabled={submitting} onClick={linkOauthOnClick} type="button">
          {linked ? "Change account" : "Link account"}
        </Button>
        {linked && <ButtonUnlink provider={provider} submitting={submitting} setSubmitting={setSubmitting} />}
      </div>
    </article>
  );
}
