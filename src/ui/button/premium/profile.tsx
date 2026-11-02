"use client";

import type React from "react";
import { useSnapshot } from "valtio";
import IconPremium from "#src/icons/premium.svg";
import { showAlertErrorApp, showAlertErrorServer } from "#src/lib/alert";
import { requestProfilePremiumPlanUpgrade } from "#src/lib/request";
import globalState from "#src/lib/state";
import Button from "#src/ui/button";

export default function ButtonUpgradeProfilePremium(): React.ReactNode {
  const { currentProfile } = useSnapshot(globalState);

  async function requestOnClick(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    if (!currentProfile?.public_id) {
      return;
    }

    const el = (event.currentTarget || event.target) as HTMLButtonElement;

    el.disabled = true;

    const res = await requestProfilePremiumPlanUpgrade(currentProfile?.public_id);

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
    <Button className="pe-3.5" onClick={requestOnClick} type="button">
      <IconPremium width="1.25em" />
      Upgrade to premium
    </Button>
  );
}
