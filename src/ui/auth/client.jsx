"use client";

import useAuthOffline from "#src/lib/hooks/auth/offline";
import Message from "#src/ui/message";

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export default function WithAuthClient({ children }) {
  return useAuthOffline() ? children : <Message>Redirecting...</Message>;
}
