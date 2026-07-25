import ButtonDownloadAccountData from "#src/ui/button/download/account";
import ButtonDeleteAccount from "#src/ui/button/danger/delete/account";

export default function SettingsData() {
  return (
    <div id="data">
      <h1 className="text-3xl">My data</h1>
      <div className="text-zinc-200">
        <p className="my-4">
          All data associated with your account can be manually exported and downloaded at any time, ensuring complete access and
          portability of your information. You can also export each profile data separately in the profile settings and{" "}
          <strong>Polar.sh</strong> data in the <a href="#payments">payments</a> settings.
        </p>
        <p className="my-4">Your data is exported in a standard, machine-readable JSON format, allowing you to easily view it.</p>
        <ButtonDownloadAccountData />
      </div>
      <h2 className="mbs-8 text-2xl text-rose-400">Delete account</h2>
      <div className="text-zinc-200">
        <p className="my-4">
          Closing your account is a permanent action. All your profiles, active premium subscriptions, and personal information{" "}
          <strong>will be deleted permanently and will not be recoverable</strong>.
        </p>
        <p className="my-4">
          Please ensure you have downloaded any important data before proceeding, as accounts cannot be restored once the deletion process
          is complete.
        </p>
        <ButtonDeleteAccount />
      </div>
    </div>
  );
}
