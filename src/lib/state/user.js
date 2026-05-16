import globalState from "#src/lib/state";

/**
 * @function deleteUserState
 */
export function deleteUserState() {
  delete globalState.email;
  delete globalState.email2;
  delete globalState.displayName;
  delete globalState.oauth;
  delete globalState.profiles;
}

/**
 * @function updateUserState
 * @param {any} data
 */
export function updateUserState(data) {
  if (!data.email && !data.email2 && !data.oauth) {
    deleteUserState();
    return;
  }

  globalState.displayName = data.display_name || data.email?.split("@")[0];
  globalState.email = data.email;
  globalState.oauth = data.oauth;
  globalState.polarShCreatedAt = data.polar_created_at;

  // TODO: Optimize this.
  if (globalState.profiles?.length && data.profiles?.length) {
    for (let i = 0; i < data.profiles.length; i++) {
      const profileEntry = data.profiles[i];

      const existingProfileEntry = globalState.profiles.find(storedProfile => storedProfile.public_id === profileEntry.public_id);

      if (existingProfileEntry) {
        data.profiles[i] = { ...existingProfileEntry, ...profileEntry };
      }
    }
  }

  globalState.profiles = data.profiles;
}
