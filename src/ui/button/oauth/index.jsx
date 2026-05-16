import { alertErrorApp, alertErrorServer } from "#src/lib/alert";
import { requestOauthLink } from "#src/lib/request";
import ButtonNext from "#src/ui/button/next";
import styles from "./index.module.scss";

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.provider
 * @returns {React.ReactNode}
 */
export default function Oauth({ children, provider }) {
  /**
   * @async
   * @function redirectToOauth
   * @param {React.MouseEvent<HTMLButtonElement>} event
   */
  async function redirectToOauth(event) {
    const el = event.currentTarget || event.target;

    el.disabled = true;

    const res = await requestOauthLink(provider);

    if (!res) {
      el.disabled = false;
      return;
    }

    if (!res.ok) {
      alertErrorApp();
      el.disabled = false;
      return;
    }

    const href = await res.text();

    if (!href) {
      alertErrorServer();
      el.disabled = false;
      return;
    }

    window.location.href = href;
  }

  return (
    <ButtonNext
      className={styles["btn-oauth"]}
      onClick={redirectToOauth}
      title={provider[0].toUpperCase() + provider.substring(1)}
      type="button"
    >
      {children}
    </ButtonNext>
  );
}
