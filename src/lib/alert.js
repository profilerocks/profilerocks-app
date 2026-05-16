/**
 * @function
 * @param {string} message
 */
export function alertMessage(message) {
  alert(message);
}

/**
 * @function alertErrorApp
 */
export function alertErrorApp() {
  alertMessage("Oops! Something went wrong. Please try reloading the app to get things back on track.");
}

/**
 * @function alertErrorServer
 */
export function alertErrorServer() {
  alertMessage("The server seems to be having a bit of trouble right now. Please try again in a few moments.");
}
