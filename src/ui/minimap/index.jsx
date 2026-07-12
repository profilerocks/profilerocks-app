import { HREF_HELP, HREF_LEGAL, HREF_PRIVACY, HREF_TERMS } from "#src/lib/env";

/**
 * @function
 * @param {Object} props
 * @param {string} [props.className]
 */
export default function Minimap({ className: customClassName }) {
  return (
    <nav
      className={
        "flex flex-wrap justify-center gap-1 text-sm select-none *:rounded-3xl *:px-3 *:py-2 *:text-zinc-400 *:transition-colors *:hover:bg-zinc-800 *:hover:text-zinc-200 *:focus-visible:bg-zinc-700 *:focus-visible:text-zinc-100 *:active:bg-zinc-700 *:active:text-zinc-100" +
        (customClassName ? " " + customClassName : "")
      }
    >
      <a href={HREF_HELP} rel="help" target="_blank">
        Help
      </a>
      <a href={HREF_PRIVACY} rel="privacy-policy" target="_blank">
        Privacy
      </a>
      <a href={HREF_TERMS} rel="terms-of-service" target="_blank">
        Terms
      </a>
      <a href={HREF_LEGAL} rel="noopener noreferrer" target="_blank">
        Legal Notice
      </a>
    </nav>
  );
}
