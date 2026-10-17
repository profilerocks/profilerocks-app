"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * @function
 * @param {any} redirect
 */
export default function useAuthRedirect(redirect) {
  const router = useRouter();

  useEffect(() => {
    if (redirect) {
      router.replace("/u/enter"); // Redirect to login if not authenticated
    }
  }, [redirect]);
}
