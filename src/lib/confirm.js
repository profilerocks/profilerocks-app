import { showAlertErrorApp } from "#src/lib/alert";
import { requestUserLogout, requestUserAllSessionsLogout } from "#src/lib/request";
import globalState from "#src/lib/state";
import { deleteUserState } from "#src/lib/state/user";

/**
 * @import {GlobalState} from "#src/lib/state"
 */

/**
 * @function showConfirm
 * @param {string} message
 * @param {Exclude<GlobalState["dialogConfirmFunction"],undefined>} confirmFunction
 * @returns {void}
 */
export function showConfirm(message, confirmFunction) {
  confirmFunction(window.confirm(message));
  // globalState.dialogContent = message;
  // globalState.dialogConfirmFunction = confirmFunction;
  // globalState.dialogOpen = true;
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
          deleteUserState();
        } else {
          showAlertErrorApp();
        }
      }
    }
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
          deleteUserState();
        } else {
          showAlertErrorApp();
        }
      }
    }
  });
}
