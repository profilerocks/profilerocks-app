import { useSyncExternalStore } from "react";

/**
 * @callback Template
 */

/**
 * @function getSnapshot
 * @returns {boolean}
 */
function getSnapshot() {
  return navigator.onLine;
}

/**
 * @function getServerSnapshot
 * @returns {boolean}
 */
function getServerSnapshot() {
  return true; // Always show "Online" for server-generated HTML
}

/**
 * @function subscribe
 * @param {Template} callback
 * @return {Template}
 */
function subscribe(callback) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

/**
 * @function
 * @returns {boolean}
 */
export default function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
