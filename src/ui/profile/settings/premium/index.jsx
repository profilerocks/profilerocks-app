import ProfileWatermark from "#src/ui/profile/watermark";
import SettingsProfileTitle from "#src/ui/profile/title";
import SettingsProfileMetaDescription from "#src/ui/profile/meta/description";

export default function ProfilePremiumSettings() {
  return (
    <fieldset className="my-6 px-3 border-2 border-yellow-400 rounded-lg">
      <legend className="px-2 text-xl">Premium Settings</legend>
      <p className="mbs-2 mbe-4">Settings only available for premium profiles.</p>
      <ProfileWatermark />
      <SettingsProfileTitle />
      <SettingsProfileMetaDescription />
    </fieldset>
  );
}
