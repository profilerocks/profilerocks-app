"use client";

import Link from "next/link";
import { useSnapshot } from "valtio";
import { HREF_CONTACT } from "#src/lib/env";
import { useProfileActivePremium } from "#src/lib/hooks/state";
import globalState from "#src/lib/state";
import ButtonUpgradeProfilePremium from "#src/ui/button/premium/profile";

/**
 * @function
 * @param {React.ComponentPropsWithoutRef<"div">} props
 * @returns {React.ReactNode}
 */
export default function ProfileCurrentPlan(props) {
  const premiumActive = useProfileActivePremium();
  const { currentProfile } = useSnapshot(globalState);

  if (!currentProfile) {
    return null;
  }

  return (
    <div {...props}>
      <h2 className="mbe-3 text-lg text-zinc-300">
        Current plan:{" "}
        <strong className={currentProfile.premium ? "text-yellow-400" : "text-zinc-200"}>
          {currentProfile.premium ? "Premium" : "Free"}
        </strong>
      </h2>
      {currentProfile.premium ? (
        <>
          <p>
            You can manage the payment in the <Link href="/u/settings#payments">payment settings</Link>.
          </p>
          <p>
            Status:{" "}
            <strong>
              {currentProfile.premium.canceled_at
                ? "canceled"
                : currentProfile.premium.subscription_status || currentProfile.premium.order_status}
            </strong>
          </p>
          {currentProfile.premium.current_period_end && (
            <p>
              {currentProfile.premium.canceled_at ? "Ends at" : "Renovation"}:{" "}
              {new Date(currentProfile.premium.current_period_end * 1000).toDateString()}
            </p>
          )}
          {(currentProfile.premium.subscription_status || !premiumActive) && (
            <p>
              <strong>Note:</strong> It might take a few minutes to change the status
            </p>
          )}
        </>
      ) : (
        <ButtonUpgradeProfilePremium />
      )}
      <p className="mbs-4 text-sm text-zinc-400">
        If you think this is a mistake, please{" "}
        <Link href={HREF_CONTACT} target="_blank">
          contact support
        </Link>
      </p>
    </div>
  );
}
