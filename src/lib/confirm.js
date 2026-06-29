import { showAlertErrorApp } from "#src/lib/alert";
import { requestUserLogout, requestUserAllSessionsLogout } from "#src/lib/request";
import { deleteUserState } from "#src/lib/state/user";

/**
 * @callback ConfirmFunction
 * @param {boolean} confirmResult
 */

/**
 * @function showConfirm
 * @param {string} message
 * @param {ConfirmFunction} confirmFunction
 * @returns {void}
 */
export function showConfirm(message, confirmFunction) {
  confirmFunction(window.confirm(message));
}

/**
 * @function showLogOutConfirm
 */
export function showLogOutConfirm() {
  showConfirm("Are you sure you want to log out?", async (confirmResult) => {
    if (confirmResult) {
      const res = await requestUserLogout();

      if (res) {
        if (res.ok) {
          deleteUserState()
        } else {
          showAlertErrorApp()
        }

        return res.ok
      }
    }

    return false;
  });
}

/**
 * @function showLogOutAllSessionsConfirm
 */
export function showLogOutAllSessionsConfirm() {
  showConfirm("Are you sure you want to log out of all sessions?", async (confirmResult) => {
    if (confirmResult) {
      const res = await requestUserAllSessionsLogout();

      if (res) {
        if (res.ok) {
          deleteUserState()
        } else {
          showAlertErrorApp()
        }

        return res.ok
      }
    }

    return false;
  });
}
