"use client";

import { HREF_PRIVACY, HREF_TERMS } from "#src/lib/env";
import { requestOtpEnterCreation } from "#src/lib/request";
import IconAgreement from "#src/icons/agreement.svg";
import IconInfo from "#src/icons/info.svg";
import OauthGoogle from "#src/ui/button/oauth/google";
import FormUserEmail from "#src/ui/form/email";
import styles from "./page.module.scss";

export default function PageUserEnter() {
  return (
    <>
      <h1>Log in or register</h1>
      <FormUserEmail
        buttonChildren={
          <>
            <IconAgreement width="1.25em" />
            Agree and continue
          </>
        }
        requestOtpCreation={requestOtpEnterCreation}
      >
        <p className={styles.info}>
          <IconInfo />
          <span className={styles.text}>
            By accessing this platform, you agree to the{" "}
            <a href={HREF_PRIVACY} target="_blank" rel="privacy-policy">
              Privacy Policy
            </a>{" "}
            and{" "}
            <span className={styles.unbreakable}>
              <a href={HREF_TERMS} target="_blank" rel="terms-of-service">
                Terms of Service
              </a>
              .
            </span>
          </span>
        </p>
      </FormUserEmail>
      <p className={styles["p-separator"]}>OR</p>
      <OauthGoogle>Continue with Google</OauthGoogle>
    </>
  );
}
