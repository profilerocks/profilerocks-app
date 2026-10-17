"use client";

import { useSnapshot } from "valtio";

import useAuthRedirect from "#src/lib/hooks/auth/redirect";
import globalState from "#src/lib/state";

/**
 * Checks Authentication from state instead of fetching data from the server.
 *
 * @function
 * @returns {boolean}
 */
export default function useAuthOffline() {
  const { email, email2, oauth } = useSnapshot(globalState);
  const redirect = !email && !email2 && !oauth;

  useAuthRedirect(redirect);

  return !redirect;
}
