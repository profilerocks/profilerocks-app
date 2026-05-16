"use client";

import { useSnapshot } from "valtio";
import { alertErrorApp, alertErrorServer } from "#src/lib/alert";
import { requestProfilePremiumPlanUpgrade } from "#src/lib/request";
import globalState from "#src/lib/state";
import Button from "#src/ui/button";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function ButtonUpgradePremium() {
  const { currentProfile } = useSnapshot(globalState);

  /**
   * @async
   * @function requestOnClick
   * @param {React.MouseEvent<HTMLButtonElement>} event
   */
  async function requestOnClick(event) {
    if (!currentProfile?.public_id) {
      return;
    }

    const el = event.currentTarget || event.target;

    el.disabled = true;

    const res = await requestProfilePremiumPlanUpgrade(currentProfile?.public_id);

    if (!res) {
      el.disabled = false;
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      el.disabled = false;
      return;
    }

    const href = await res.text();

    if (!href) {
      alertErrorServer();
      el.disabled = false;
      return;
    }

    window.location.href = href;
  }

  return (
    <Button onClick={requestOnClick} type="button">
      Upgrade to premium
    </Button>
  );
}
