"use client";

import { HREF_PRIVACY, HREF_TERMS } from "#src/lib/env";
import { requestOtpEnterCreation } from "#src/lib/request";
import IconAgreement from "#src/icons/agreement.svg";
import IconInfo from "#src/icons/info.svg";
import Anchor from "#src/ui/anchor";
import OauthGoogle from "#src/ui/button/oauth/google";
import FormUserEmail from "#src/ui/form/email";
// import styles from "./page.module.scss";

const formButtonChildren = (
  <>
    <IconAgreement width="1.25em" />
    Agree and continue
  </>
);

export default function PageUserEnter() {
  return (
    <>
      <h1 className="mbe-4 text-3xl">Log in or register</h1>
      <FormUserEmail buttonChildren={formButtonChildren} requestOtpCreation={requestOtpEnterCreation}>
        <p className="mx-2.5 my-5 flex items-start gap-2.5 text-sm">
          <IconInfo className="max-w-5 text-teal-500" />
          <span className="">
            By accessing this platform, you agree to the{" "}
            <Anchor href={HREF_PRIVACY} target="_blank" rel="privacy-policy">
              Privacy Policy
            </Anchor>{" "}
            and{" "}
            <span className="whitespace-nowrap">
              <Anchor href={HREF_TERMS} target="_blank" rel="terms-of-service">
                Terms of Service
              </Anchor>
              .
            </span>
          </span>
        </p>
      </FormUserEmail>
      <p className="my-5 flex items-center gap-4 text-sm text-zinc-300 before:h-px before:flex-1 before:bg-zinc-700 after:h-px after:flex-1 after:bg-zinc-700">
        OR
      </p>
      <OauthGoogle>Continue with Google</OauthGoogle>
    </>
  );
}
