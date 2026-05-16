import FormUserEmail from "#src/ui/form/email";
import { requestOtpUpdateCreation } from "#src/lib/request";

export default function SettingsEmail() {
  return (
    <div id="email">
      <h1>Email address</h1>
      <p>Used for authentication and contact information. You can always change it.</p>
      <FormUserEmail hrefBack="#home" requestOtpCreation={requestOtpUpdateCreation} />
    </div>
  );
}
