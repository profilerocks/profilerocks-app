"use client";

import { useSnapshot } from "valtio";
import IconPolarSh from "#src/icons/polar.sh.svg";
import { showAlertErrorApp } from "#src/lib/alert";
import { HREF_CONTACT } from "#src/lib/env";
import { requestPolarSession } from "#src/lib/request";
import globalState from "#src/lib/state";
import { msToSeconds } from "#src/lib/time";
import ButtonNext from "#src/ui/button/next";
import Link from "#src/ui/link";

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
        showAlertErrorApp();
        el.disabled = false;
        return;
      }

      globalState.polarShSessionUrl = await res.text();

      if (!globalState.polarShSessionUrl) {
        showAlertErrorApp();
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

export default function PolarShSettings() {
  const { polarShCreatedAt } = useSnapshot(globalState);

  return polarShCreatedAt ? (
    <>
      <ButtonPolarSh />
    </>
  ) : (
    <>
      <p className="my-4">You haven't made any payments yet. If you think this is a mistake, please contact support.</p>
      <p>
        <Link href={HREF_CONTACT} target="_blank">
          {HREF_CONTACT}
        </Link>
      </p>
    </>
  );
}
