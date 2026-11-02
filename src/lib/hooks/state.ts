"use client";

import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import globalState from "#src/lib/state";
import { secondsToMs } from "#src/lib/time";

export function useUserEmail(): string {
  const { email } = useSnapshot(globalState);
  return email || "";
}

export function useUserDisplayName(): string {
  const { displayName } = useSnapshot(globalState);
  return displayName || "";
}

export function useProfileActivePremium(): boolean {
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

export function useProfileActivePremiumSubscription(): boolean {
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

export function useProfileName(): string {
  const { currentProfile } = useSnapshot(globalState);
  return currentProfile?.name_id || "";
}
