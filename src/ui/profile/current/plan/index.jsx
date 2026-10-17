"use client";

import Link from "next/link";
import { useSnapshot } from "valtio";
import { HREF_CONTACT } from "#src/lib/env";
import { useProfileActivePremium } from "#src/lib/hooks/state";
import globalState from "#src/lib/state";
import ButtonUpgradePremium from "#src/ui/button/premium";
import styles from "./index.module.scss";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function ProfileCurrentPlan() {
  const premiumActive = useProfileActivePremium();
  const { currentProfile } = useSnapshot(globalState);

  if (!currentProfile) {
    return null;
  }

  let className = styles["profile-current-plan"];

  if (premiumActive) {
    className += ` ${styles.premium}`;
  }

  return (
    <div className={className}>
      <h2 className={styles["profile-current-plan-title"]}>
        Current plan:{" "}
        <span className={currentProfile.premium ? styles["text-premium"] : undefined}>{currentProfile.premium ? "Premium" : "Free"}</span>
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
              <strong>Note:</strong> It might take a few minutes to change the status.
            </p>
          )}
        </>
      ) : (
        <ButtonUpgradePremium />
      )}
      <p>
        If you think this is a mistake, please{" "}
        <Link href={HREF_CONTACT} target="_blank">
          contact support
        </Link>
        .
      </p>
    </div>
  );
}
