"use client";

import { useRouter } from "next/navigation";
import { requestOtpUpdateVerification } from "#src/lib/request";
import globalState from "#src/lib/state";
import { getCurrentOtpState } from "#src/lib/state/otp";
import UserEmailVerify from "#src/ui/form/email/verify";

export default function PageSettingsEmailVerify() {
  const router = useRouter();

  async function afterVerification(_res: Response) {
    globalState.email = getCurrentOtpState()?.email;
    router.push("/u/settings");
  }

  return (
    <UserEmailVerify afterVerification={afterVerification} requestOtpVerification={requestOtpUpdateVerification}>
      <h1 className="mbe-3 text-3xl">New email verification</h1>
    </UserEmailVerify>
  );
}
