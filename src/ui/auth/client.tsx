"use client";

import type React from "react";
import useAuthOffline from "#src/lib/hooks/auth/offline";
import Message from "#src/ui/message";

interface Props {
  children: React.ReactNode;
}

export default function WithAuthClient({ children }: Props): React.ReactNode {
  return useAuthOffline() ? children : <Message>Redirecting...</Message>;
}
