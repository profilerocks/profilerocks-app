"use client";

import { useEffect, useRef } from "react";
import { useSnapshot } from "valtio";

import useAuthRedirect from "#src/lib/hooks/auth/redirect";
import { requestUser } from "#src/lib/request";
import globalState from "#src/lib/state";
import { deleteUserState, updateUserState } from "#src/lib/state/user";
import { msToSeconds, secondsToMs } from "#src/lib/time";

/**
 * @function
 * @returns {(boolean|undefined)}
 */
export default function useAuth() {
  const canFetchRef = useRef(!globalState.fetched);

  /**
   * @type {React.RefObject<AbortController|undefined>}
   */
  const controllerRef = useRef(undefined);

  const loadingRef = useRef(false);
  const { email, fetched } = useSnapshot(globalState);

  const redirect = fetched ? !email : undefined;

  useAuthRedirect(redirect);

  async function fetchUser() {
    if (loadingRef.current || redirect || !canFetchRef.current) {
      return;
    }

    loadingRef.current = true;

    const res = await requestUser(controllerRef.current);

    if (res?.ok) {
      updateUserState(await res.json());
    } else {
      deleteUserState();
    }

    globalState.fetched = msToSeconds(Date.now(), Math.ceil);

    loadingRef.current = false;
  }

  useEffect(() => {
    controllerRef.current = new AbortController();

    window.addEventListener("focus", fetchUser);
    window.addEventListener("online", fetchUser);

    fetchUser();

    return () => {
      controllerRef.current?.abort();
      window.removeEventListener("focus", fetchUser);
      window.removeEventListener("online", fetchUser);
    };
  }, []);

  useEffect(() => {
    /**
     * 3 minutes.
     */
    const timeLeft = secondsToMs(fetched ?? 0) + 180000 - Date.now();

    if (timeLeft <= 0) {
      canFetchRef.current = true;
      return;
    }

    canFetchRef.current = false;

    const timeout = setTimeout(() => {
      canFetchRef.current = true;
    }, timeLeft);

    return () => {
      clearTimeout(timeout);
    };
  }, [fetched]);

  return redirect === undefined ? undefined : !redirect;
}
