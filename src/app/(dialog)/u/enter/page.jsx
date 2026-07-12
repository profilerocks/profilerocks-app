"use client";

import { HREF_PRIVACY, HREF_TERMS } from "#src/lib/env";
import { requestOtpEnterCreation } from "#src/lib/request";
import IconAgreement from "#src/icons/agreement.svg";
import IconInfo from "#src/icons/info.svg";
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
      <h1 className="text-3xl">Log in or register</h1>
      <FormUserEmail buttonChildren={formButtonChildren} requestOtpCreation={requestOtpEnterCreation}>
        <p className="">
          <IconInfo width="1em" />
          <span className="">
            By accessing this platform, you agree to the{" "}
            <a href={HREF_PRIVACY} target="_blank" rel="privacy-policy">
              Privacy Policy
            </a>{" "}
            and{" "}
            <span className="">
              <a href={HREF_TERMS} target="_blank" rel="terms-of-service">
                Terms of Service
              </a>
              .
            </span>
          </span>
        </p>
      </FormUserEmail>
      <p className="">OR</p>
      <OauthGoogle>Continue with Google</OauthGoogle>
    </>
  );
}
