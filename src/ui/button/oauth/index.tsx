"use client";

import type React from "react";
import IconArrowRight from "#src/icons/arrow/right.svg";
import { showAlertErrorApp, showAlertErrorServer } from "#src/lib/alert";
import { requestOauthLink } from "#src/lib/request";

interface OauthProps {
  children: React.ReactNode;
  provider: string;
}

export default function Oauth({ children, provider }: OauthProps): React.ReactNode {
  async function redirectToOauth(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    const el = (event.currentTarget || event.target) as HTMLButtonElement;

    el.disabled = true;

    const res = await requestOauthLink(provider);

    if (!res) {
      el.disabled = false;
      return;
    }

    if (!res.ok) {
      showAlertErrorApp();
      el.disabled = false;
      return;
    }

    const href = await res.text();

    if (!href) {
      showAlertErrorServer();
      el.disabled = false;
      return;
    }

    window.location.href = href;
  }

  return (
    <button
      className="br-4 flex w-full items-center gap-2.5 rounded-lg bg-zinc-900 p-2.5 text-zinc-400 transition-colors select-none enabled:cursor-pointer enabled:hover:bg-zinc-800 enabled:hover:text-zinc-300 enabled:active:bg-zinc-700 enabled:active:text-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:text-zinc-500"
      onClick={redirectToOauth}
      title={provider[0].toUpperCase() + provider.substring(1)}
      type="button"
    >
      {children}
      <IconArrowRight className="ms-auto drop-shadow-sm drop-shadow-black" width="1.25em" />
    </button>
  );
}
