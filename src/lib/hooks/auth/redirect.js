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
      globalState.redirect = location.pathname === "/" ? undefined : location.pathname + location.search + location.hash;
      router.replace("/u/enter"); // Redirect to login if not authenticated
    }
  }, [redirect]);
}
