"use client";

import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { isBase64UrlIdValid } from "#src/lib/id";
import globalState from "#src/lib/state";
import Message from "#src/ui/message";

interface Props {
  children: React.ReactNode;
}

/**
 * It uses `useSearchParams`, so it needs to be wrapped in a Suspense boundary.
 */
export default function AuthProfile({ children }: Props): React.ReactNode {
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
      globalState.currentProfile = undefined;
    };
  }, [profilePublicId, profiles, router]);

  return currentProfile ? children : <Message>Loading...</Message>;
}
