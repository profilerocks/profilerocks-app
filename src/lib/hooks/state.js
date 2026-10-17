"use client";

import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import globalState from "#src/lib/state";
import { secondsToMs } from "#src/lib/time";

/**
 * @function useUserEmail
 * @returns {string}
 */
export function useUserEmail() {
  const { email } = useSnapshot(globalState);
  return email || "";
}

/**
 * @function useUserDisplayName
 * @returns {string}
 */
export function useUserDisplayName() {
  const { displayName } = useSnapshot(globalState);
  return displayName || "";
}

/**
 * @function useProfileActivePremium
 * @returns {boolean}
 */
export function useProfileActivePremium() {
  const { currentProfile } = useSnapshot(globalState);
  const activePremiumSubscription = useProfileActivePremiumSubscription();

  if (!currentProfile?.premium) {
    return false;
  }

  return (
    currentProfile.premium.order_status === "paid" ||
    currentProfile.premium.subscription_status === "active" ||
    (currentProfile.premium.subscription_status === "canceled" && activePremiumSubscription)
  );
}

/**
 * @function useProfileActivePremiumSubscription
 * @returns {boolean}
 */
export function useProfileActivePremiumSubscription() {
  const { currentProfile } = useSnapshot(globalState);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (currentProfile?.premium?.current_period_end) {
      const timeDifference = secondsToMs(currentProfile.premium.current_period_end) - Date.now();

      if (timeDifference > 0) {
        setActive(true);

        const timeoutId = setTimeout(() => {
          setActive(false);
        }, timeDifference);

        return () => {
          clearTimeout(timeoutId);
        };
      } else {
        setActive(false);
      }
    }
  }, [currentProfile?.premium?.current_period_end]);

  if (!currentProfile?.premium) {
    return false;
  }

  return active;
}

/**
 * @function useProfileName
 * @returns {string}
 */
export function useProfileName() {
  const { currentProfile } = useSnapshot(globalState);
  return currentProfile?.name_id || "";
}
