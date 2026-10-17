import ButtonDeleteProfileMembership from "#src/ui/button/danger/delete/profile";
import ButtonDownloadProfileData from "#src/ui/button/download/profile";
import { FormProfileNameIdUpdate } from "#src/ui/form/profile/name";
import Link from "#src/ui/link";
import ProfileCurrentPlan from "#src/ui/profile/plan";
import ProfilePremiumSettings from "#src/ui/profile/settings/premium";

/**
 * @function
 * @returns {React.ReactNode}
 */
export default function PageProfileSettings() {
  return (
    <>
      <h1 className="text-3xl">Profile Settings</h1>
      <ProfileCurrentPlan className="mbs-4" />
      <ProfilePremiumSettings />
      <h2>Change profile name</h2>
      <FormProfileNameIdUpdate />
      <h2>Profile data</h2>
      <p className="text-zinc-300">
        You can export the profile data in a standard, machine-readable JSON format. The option to export your account data can be found in
        the <Link href="/u/settings#data">account settings</Link>.
      </p>
      <ButtonDownloadProfileData />
      <h2 className="text-2xl text-rose-400">Danger zone</h2>
      <p className="text-zinc-300">
        After deletion, the profile and its associated plan will be{" "}
        <strong className="text-zinc-200">permanently removed and cannot be recovered</strong>.
      </p>
      <ButtonDeleteProfileMembership />
    </>
  );
}
