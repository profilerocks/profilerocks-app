"use client";

import { useState } from "react";
import { useSnapshot } from "valtio";
import { alertErrorApp, alertErrorServer } from "#src/lib/alert";
import { requestOauthDelete, requestOauthLink } from "#src/lib/request";
import globalState from "#src/lib/state";
import { secondsToMs } from "#src/lib/time";
import Button from "#src/ui/button";
import ButtonDanger from "#src/ui/button/danger";
import styles from "./index.module.scss";

/**
 * @function
 * @param {Object} props
 * @param {string} props.provider
 * @param {boolean} props.submitting
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setSubmitting
 * @returns {React.ReactNode}
 */
function ButtonUnlink({ provider, submitting, setSubmitting }) {
  /**
   * @async
   * @function onSubmit
   * @param {React.MouseEvent<HTMLButtonElement>} _event
   */
  async function unlinkOauthOnClick(_event) {
    if (!confirm(`Are you sure you want to unlink your ${provider[0].toUpperCase() + provider.substring(1).toLowerCase()} account?`)) {
      return;
    }

    if (!globalState.oauth?.[provider]) {
      alertErrorApp();
      return;
    }

    setSubmitting(true);

    const res = await requestOauthDelete(provider);

    if (!res) {
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      return;
    }

    delete globalState.oauth?.[provider];

    setSubmitting(false);
  }

  return (
    <ButtonDanger disabled={submitting} onClick={unlinkOauthOnClick} type="button">
      Unlink
    </ButtonDanger>
  );
}

/**
 * @function
 * @param {Object} props
 * @param {React.ComponentType<React.SVGProps<SVGSVGElement>>} props.Icon
 * @param {string} props.provider
 * @returns {React.ReactNode}
 */
export default function SettingsOauth({ Icon, provider }) {
  const { oauth } = useSnapshot(globalState);
  const [submitting, setSubmitting] = useState(false);

  const linked = oauth?.[provider] && new Date(secondsToMs(oauth.google));

  let className = styles.oauth;

  if (linked) {
    className += " " + styles.linked;
  }

  /**
   * @async
   * @function onSubmit
   * @param {React.MouseEvent<HTMLButtonElement>} _event
   */
  async function linkOauthOnClick(_event) {
    if (
      linked &&
      !confirm(`Are you sure you want to change your ${provider[0].toUpperCase() + provider.substring(1).toLowerCase()} account?`)
    ) {
      return;
    }

    setSubmitting(true);

    const res = await requestOauthLink(provider, true);

    if (!res) {
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      setSubmitting(false);
      return;
    }

    const href = await res.text();

    if (!href) {
      alertErrorServer();
      setSubmitting(false);
      return;
    }

    window.location.href = href;
  }

  return (
    <article className={className}>
      <div className={styles["oauth-provider"]}>
        <Icon width="2.5em" />
        <hgroup className={styles["oauth-hgroup"]}>
          <h2 className={styles["oauth-title"]}>{provider[0].toUpperCase() + provider.substring(1).toLowerCase()}</h2>
          <p className={styles["oauth-linked"]}>
            {linked ? (
              <>
                Linked on <time dateTime={linked.toISOString().split("T")[0]}>{linked.toDateString()}</time>
              </>
            ) : (
              "Not linked"
            )}
          </p>
        </hgroup>
      </div>
      <div className={styles["oauth-actions"]}>
        <Button disabled={submitting} onClick={linkOauthOnClick} type="button">
          {linked ? "Change account" : "Link account"}
        </Button>
        {linked && <ButtonUnlink provider={provider} submitting={submitting} setSubmitting={setSubmitting} />}
      </div>
    </article>
  );
}
