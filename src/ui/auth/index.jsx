"use client";

import useAuth from "#src/lib/hooks/auth";
import Message from "#src/ui/message";

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export default function WithAuth({ children }) {
  const allowed = useAuth();

  if (allowed) {
    return children;
  }

  return <Message>{allowed === undefined ? "Loading..." : "Redirecting..."}</Message>;
}
