"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useAuthRedirect(redirect?: boolean | null): void {
  const router = useRouter();

  useEffect(() => {
    if (redirect) {
      router.replace("/u/enter"); // Redirect to login if not authenticated
    }
  }, [redirect, router]);
}
