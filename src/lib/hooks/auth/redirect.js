"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import globalState from "#src/lib/state";

/**
 * @function
 * @param {any} redirect
 */
export default function useAuthRedirect(redirect) {
  const router = useRouter();

  useEffect(() => {
    if (redirect) {
      if (location.pathname === "/") {
        delete globalState.redirect;
      } else {
        globalState.redirect = location.pathname + location.search + location.hash;
      }
      router.replace("/u/enter"); // Redirect to login if not authenticated
    }
  }, [redirect]);
}
