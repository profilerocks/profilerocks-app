export function showAlert(message: string) {
  window.alert(message);
}

export function showAlertErrorApp() {
  showAlert("Oops! Something went wrong. Please try reloading the app to get things back on track.");
}

export function showAlertErrorServer() {
  showAlert("The server seems to be having a bit of trouble right now. Please try again in a few moments.");
}
