"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { isBase64UrlIdValid } from "#src/lib/id";
import globalState from "#src/lib/state";
import Message from "#src/ui/message";

/**
 * It uses `useSearchParams`, so it needs to be wrapped in a Suspense boundary.
 *
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export default function AuthProfile({ children }) {
  const { currentProfile, profiles } = useSnapshot(globalState);
  const searchParams = useSearchParams();
  const router = useRouter();
  const profilePublicId = searchParams.get("id");

  useEffect(() => {
    if (!profilePublicId || !isBase64UrlIdValid(profilePublicId)) {
      router.replace("/");
      return;
    }

    globalState.currentProfile = globalState.profiles?.find(({ public_id }) => public_id === profilePublicId);

    if (!globalState.currentProfile) {
      router.replace("/");
    }

    return () => {
      delete globalState.currentProfile;
    };
  }, [profilePublicId, profiles, router]);

  return currentProfile ? children : <Message>Loading...</Message>;
}
