import FormUserEmail from "#src/ui/form/email";
import { requestOtpUpdateCreation } from "#src/lib/request";

export default function SettingsEmail() {
  return (
    <div id="email">
      <h1 className="text-3xl">Email address</h1>
      <p className="text-zinc-200 my-4">Used for authentication and contact information. You can always change it.</p>
      <FormUserEmail hrefBack="#home" requestOtpCreation={requestOtpUpdateCreation} />
    </div>
  );
}
