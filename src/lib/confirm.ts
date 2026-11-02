import { showAlertErrorApp } from "#src/lib/alert";
import { requestUserLogout, requestUserAllSessionsLogout } from "#src/lib/request";
import type { GlobalState } from "#src/lib/state";
import { deleteUserState } from "#src/lib/state/user";

/**
 * @param message
 * @param confirmFunction
 */
export function showConfirm(
  message: string,
  confirmFunction: Exclude<GlobalState["dialogConfirmFunction"], undefined>
): void {
  confirmFunction(window.confirm(message));
}

export function showLogOutConfirm(): void {
  showConfirm("Are you sure you want to log out?", async (confirmResult: boolean) => {
    if (confirmResult) {
      const res = await requestUserLogout();

      if (res) {
        if (res.ok) {
          deleteUserState();
        } else {
          showAlertErrorApp();
        }
      }
    }
  });
}

export function showLogOutAllSessionsConfirm(): void {
  showConfirm("Are you sure you want to log out of all sessions?", async (confirmResult: boolean) => {
    if (confirmResult) {
      const res = await requestUserAllSessionsLogout();

      if (res) {
        if (res.ok) {
          deleteUserState();
        } else {
          showAlertErrorApp();
        }
      }
    }
  });
}
