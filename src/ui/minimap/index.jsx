import { HREF_HELP, HREF_LEGAL, HREF_PRIVACY, HREF_TERMS } from "#src/lib/env";

/**
 * @function
 * @param {Object} props
 * @param {string} props.className
 */
export default function Minimap({ className: customClassName }) {
  return (
    <nav className={"flex flex-wrap justify-center gap-2 *:transition-colors" + (customClassName ? " " + customClassName : "")}>
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
