import globalState from "#src/lib/state";
import { secondsToMs } from "#src/lib/time";

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
 * @function isProfilePremium
 * @param {string} profilePublicId
 * @returns {boolean}
 */
export function isProfilePremium(profilePublicId) {
  if (!globalState.profiles?.length) {
    return false;
  }

  const profile = globalState.profiles.find(({ public_id }) => public_id === profilePublicId);

  if (!profile || !profile.premium) {
    return false;
  }

  return (
    profile.premium.order_status === "paid" ||
    profile.premium.subscription_status === "active" ||
    (profile.premium.subscription_status === "canceled" &&
      typeof profile.premium.current_period_end === "number" &&
      secondsToMs(profile.premium.current_period_end) - Date.now() <= 0)
  );
}

/**
 * @function updateProfileDataEntry
 * @param {string} profilePublicId
 * @param {string} tag
 * @param {string} content
 * @param {(boolean|null)} [embed]
 * @returns {boolean}
 */
export function updateProfileDataEntry(profilePublicId, tag, content, embed) {
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

  if (embed !== undefined) {
    entry.embed = embed;
  }

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
