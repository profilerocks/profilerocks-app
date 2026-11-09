import { HREF_CONTACT } from "#src/lib/env";
import ButtonDeleteProfileMembership from "#src/ui/button/danger/delete/profile";
import ButtonDownloadProfileData from "#src/ui/button/download/profile";
import FormProfileMetaDescription from "#src/ui/form/profile/meta/description";
import { FormProfileNameIdUpdate } from "#src/ui/form/profile/name";
import FormProfileTitle from "#src/ui/form/profile/title";
import Link from "#src/ui/link";
import ProfileCurrentPlan from "#src/ui/profile/plan";
import ProfileWatermark from "#src/ui/profile/watermark";

export default function PageProfileSettings() {
  return (
    <>
      <h1 className="text-3xl">Profile Settings</h1>
      <div className="mbs-4">
        <ProfileCurrentPlan />
        <p className="mbs-4 text-sm text-zinc-400">
          If you think this is a mistake, please{" "}
          <Link href={HREF_CONTACT} target="_blank">
            contact support
          </Link>
        </p>
      </div>
      <div className="border-y border-yellow-400 mbs-8">
        <h2 className="text-2xl text-yellow-400 mbs-4">Premium Settings</h2>
        <p className="text-zinc-300 mbs-2 mbe-4">Settings only available for premium profiles.</p>
        <ProfileWatermark />
        <h2 className="text-xl text-yellow-400 mbs-4">Page title</h2>
        <p className="text-zinc-400">A web page title appears in browser tabs, search results, bookmarks, and social media previews.</p>
        <FormProfileTitle />
        <h2 className="text-xl text-yellow-400 mbs-4">Meta description</h2>
        <p className="text-zinc-400">A meta description appears in search results and social media previews to summarize the page content.</p>
        <FormProfileMetaDescription />
      </div>
      <h2 className="mbs-10 text-2xl text-zinc-300">Change profile name</h2>
      <FormProfileNameIdUpdate />
      <h2 className="mbs-10 text-2xl text-zinc-300">Profile data</h2>
      <p className="my-4 text-zinc-400">
        You can export the profile data in a standard, machine-readable JSON format. The option to export your account data can be found in
        the <Link href="/u/settings#data">account settings</Link>.
      </p>
      <ButtonDownloadProfileData />
      <h2 className="mbs-10 text-2xl text-rose-400">Danger zone</h2>
      <p className="my-4 text-zinc-400">
        After deletion, the profile and its associated plan will be{" "}
        <strong className="text-zinc-300">permanently removed and cannot be recovered</strong>.
      </p>
      <ButtonDeleteProfileMembership />
    </>
  );
}
