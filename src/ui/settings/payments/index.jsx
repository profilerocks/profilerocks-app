"use client";

import { useSnapshot } from "valtio";
import IconPolarSh from "#src/icons/polar.sh.svg";
import { alertErrorApp } from "#src/lib/alert";
import { HREF_CONTACT } from "#src/lib/env";
import { requestPolarSession } from "#src/lib/request";
import globalState from "#src/lib/state";
import { msToSeconds } from "#src/lib/time";
import ButtonNext from "#src/ui/button/next";

function ButtonPolarSh() {
  /**
   * @async
   * @function redirectToPolarOnClick
   * @param {React.MouseEvent<HTMLButtonElement>} event
   */
  async function redirectToPolarOnClick(event) {
    if (
      !globalState?.polarShSessionUrl ||
      !globalState?.polarShSessionUrlExpires ||
      globalState.polarShSessionUrlExpires <= msToSeconds(Date.now(), Math.ceil)
    ) {
      const el = event.currentTarget || event.target;

      el.disabled = true;

      const res = await requestPolarSession();

      if (!res) {
        el.disabled = false;
        return;
      }

      if (!res.ok) {
        alertErrorApp();
        el.disabled = false;
        return;
      }

      globalState.polarShSessionUrl = await res.text();

      if (!globalState.polarShSessionUrl) {
        alertErrorApp();
        el.disabled = false;
        return;
      }

      const expiresString = res.headers.get("Expires");

      if (expiresString) {
        try {
          globalState.polarShSessionUrlExpires = msToSeconds(new Date(expiresString).getTime());
        } catch {}
      }

      /**
       * If `Expires` headers is not set, default to 4 seconds from now.
       */
      globalState.polarShSessionUrlExpires ??= msToSeconds(Date.now()) + 4;
    }

    window.location.href = globalState.polarShSessionUrl;
  }

  return (
    <ButtonNext onClick={redirectToPolarOnClick} type="button">
      <IconPolarSh width="1.25em" />
      Manage payments in Polar
    </ButtonNext>
  );
}

function PolarShSettings() {
  const { polarShCreatedAt } = useSnapshot(globalState);

  return polarShCreatedAt ? (
    <>
      <ButtonPolarSh />
    </>
  ) : (
    <>
      <p>You haven't made any payments yet. If you think this is a mistake, please contact support.</p>
      <p>
        <a href={HREF_CONTACT} target="_blank">
          {HREF_CONTACT}
        </a>
      </p>
    </>
  );
}

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function SettingsPayments() {
  return (
    <div id="payments">
      <h1>Payments</h1>
      <p>
        Payments are processed through <strong>Polar.sh</strong>.
      </p>
      <p>In the near future, you will also be able to view and manage payments and subscriptions from here.</p>
      <PolarShSettings />
    </div>
  );
}
