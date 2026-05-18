import globalState from "#src/lib/state";

/**
 * @import {Profile} from "#src/lib/state"
 */

/**
 * @function deleteProfileDataEntry
 * @param {string} profilePublicId
 * @param {string} tag
 * @returns {boolean}
 */
export function deleteProfileDataEntry(profilePublicId, tag) {
  if (!globalState.profiles) {
    return false;
  }

  const profile = globalState.profiles.find(({ public_id }) => public_id === profilePublicId);

  if (!profile?.data?.length) {
    return false;
  }

  const i = profile.data.findIndex(dataEntry => dataEntry.tag === tag);

  if (i < 0) {
    return false;
  }

  return profile.data.splice(i, 1).length > 0;
}

/**
 * @function deleteProfileState
 * @param {string} profilePublicId
 * @returns {(Profile|undefined)} profile deleted.
 */
export function deleteProfileState(profilePublicId) {
  if (!globalState.profiles?.length) {
    return undefined;
  }

  return globalState.profiles.splice(
    globalState.profiles.findIndex(({ public_id }) => public_id === profilePublicId),
    1
  )[0];
}

/**
 * @function updateProfileDataEntryContent
 * @param {string} profilePublicId
 * @param {string} tag
 * @param {string} content
 * @returns {boolean}
 */
export function updateProfileDataEntryContent(profilePublicId, tag, content) {
  if (!globalState.profiles) {
    return false;
  }

  const profile = globalState.profiles.find(({ public_id }) => public_id === profilePublicId);

  if (!profile?.data?.length) {
    return false;
  }

  const entry = profile.data.find(dataEntry => dataEntry.tag === tag);

  if (!entry) {
    return false;
  }

  entry.content = content;

  return true;
}

/**
 * @function updateProfileState
 * @param {string} profilePublicId
 * @param {Partial<Profile>} state
 * @returns {boolean}
 */
export function updateProfileState(profilePublicId, state) {
  if (!globalState.profiles) {
    return false;
  }

  const currentProfile = globalState.profiles.find(({ public_id }) => public_id === profilePublicId);

  if (!currentProfile) {
    return false;
  }

  Object.assign(currentProfile, state);

  return true;
}
