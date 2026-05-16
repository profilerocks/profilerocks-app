"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { alertErrorServer, alertMessage } from "#src/lib/alert";

/**
 * @type {Set<string>}
 */
const oauthProviderSet = new Set();

oauthProviderSet.add("google");

/**
 * It uses `useSearchParams`, so it needs to be wrapped in a Suspense boundary.
 *
 * @function
 * @returns {React.ReactNode}
 */
export default function ErrorInSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error")?.toLowerCase();

  useEffect(() => {
    if (!error) {
      return;
    }

    switch (error) {
      case "oauth":
        const provider = searchParams.get("provider")?.toLowerCase();

        if (provider) {
          if (oauthProviderSet.has(provider)) {
            router.push(searchParams.get("context") === "update" ? "/u/settings#oauth" : "/u/enter");
            alertMessage(
              `There was a problem while trying to authenticate with ${provider[0].toUpperCase() + provider.substring(1).toLowerCase()}.`
            );
          }
        }

        break;
      case "server":
        alertErrorServer();
        break;
      case "session":
        router.push("/u/enter");
        alertMessage("There was a problem with your session. Please try to log in again.");
    }
  }, [error]);

  return null;
}
