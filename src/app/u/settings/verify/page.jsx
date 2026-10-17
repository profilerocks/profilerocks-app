"use client";

import { useRouter } from "next/navigation";
import { requestOtpUpdateVerification } from "#src/lib/request";
import globalState from "#src/lib/state";
import { getCurrentOtpState } from "#src/lib/state/otp";
import UserEmailVerify from "#src/ui/form/email/verify";

export default function PageEmailVerify() {
  const router = useRouter();

  /**
   * @async
   * @function afterVerification
   * @param {Response} _res
   */
  async function afterVerification(_res) {
    globalState.email = getCurrentOtpState()?.email;
    router.push("/u/settings");
  }

  return (
    <UserEmailVerify afterVerification={afterVerification} requestOtpVerification={requestOtpUpdateVerification}>
      <h1>Change email verification</h1>
    </UserEmailVerify>
  );
}
