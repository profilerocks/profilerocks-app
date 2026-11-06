import globalState from "#src/lib/state";
import type { Profile } from "#src/lib/state";
import { secondsToMs } from "#src/lib/time";

/**
 * @param profilePublicId
 * @param tag
 */
export function deleteProfileDataEntry(profilePublicId: string, tag: string): boolean {
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
 * @param profilePublicId
 * @returns profile deleted.
 */
export function deleteProfileState(profilePublicId: string): Profile | undefined {
  if (!globalState.profiles?.length) {
    return undefined;
  }

  return globalState.profiles.splice(
    globalState.profiles.findIndex(({ public_id }) => public_id === profilePublicId),
    1
  )[0];
}

/**
 * @param profilePublicId
 */
export function isProfilePremium(profilePublicId: string): boolean {
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
 * @param profilePublicId
 * @param tag
 * @param content
 * @param embed
 */
export function updateProfileDataEntry(profilePublicId: string, tag: string, content: string, embed?: boolean | number | null): boolean {
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
 * @param profilePublicId
 * @param state
 */
export function updateProfileState(profilePublicId: string, state: Partial<Profile>): boolean {
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
