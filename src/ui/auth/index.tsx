"use client";

import type React from "react";
import useAuth from "#src/lib/hooks/auth";
import Message from "#src/ui/message";

interface Props {
  children: React.ReactNode;
}

export default function WithAuth({ children }: Props): React.ReactNode {
  const allowed = useAuth();

  if (allowed) {
    return children;
  }

  return <Message>{allowed === undefined ? "Loading..." : "Redirecting..."}</Message>;
}
