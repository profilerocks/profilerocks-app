"use client";

import { useRouter } from "next/navigation";
import { requestOtpEnterVerification } from "#src/lib/request";
import globalState from "#src/lib/state";
import { getCurrentOtpState } from "#src/lib/state/otp";
import { updateUserState } from "#src/lib/state/user";
import { msToSeconds } from "#src/lib/time";
import UserEmailVerify from "#src/ui/form/email/verify";

export default function PageEmailVerify() {
  const router = useRouter();

  /**
   * @async
   * @function afterVerification
   * @param {Response} res
   */
  async function afterVerification(res) {
    if (res.status === 204) {
      globalState.email = getCurrentOtpState()?.email;
      router.replace("/u/setup");
    } else {
      const data = await res.json();
      data[data.email ? "email2" : "email"] = getCurrentOtpState()?.email;
      updateUserState(data);
      router.replace("/");
    }

    globalState.fetched = msToSeconds(Date.now(), Math.ceil);
  }

  return (
    <UserEmailVerify afterVerification={afterVerification} requestOtpVerification={requestOtpEnterVerification}>
      <h1>Verification</h1>
    </UserEmailVerify>
  );
}
