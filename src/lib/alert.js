/**
 * @function showAlert
 * @param {string} message
 */
export function showAlert(message) {
  window.alert(message);
}

/**
 * @function showAlertErrorApp
 */
export function showAlertErrorApp() {
  showAlert("Oops! Something went wrong. Please try reloading the app to get things back on track.");
}

/**
 * @function showAlertErrorServer
 */
export function showAlertErrorServer() {
  showAlert("The server seems to be having a bit of trouble right now. Please try again in a few moments.");
}
