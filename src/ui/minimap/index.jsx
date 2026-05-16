import { HREF_HELP, HREF_LEGAL, HREF_PRIVACY, HREF_TERMS } from "#src/lib/env";
import styles from "./index.module.scss";

/**
 * @param {{ className?: string }} props
 */
export default function Minimap({ className: customClassName }) {
  let className = styles.map;

  if (customClassName) {
    className += " " + customClassName;
  }

  return (
    <ul className={className}>
      <li>
        <a href={HREF_HELP} target="_blank" rel="help">
          Help
        </a>
      </li>
      <li>
        <a href={HREF_PRIVACY} target="_blank" rel="privacy-policy">
          Privacy
        </a>
      </li>
      <li>
        <a href={HREF_TERMS} target="_blank" rel="terms-of-service">
          Terms
        </a>
      </li>
      <li>
        <a href={HREF_LEGAL} target="_blank" rel="noopener noreferrer">
          Legal Notice
        </a>
      </li>
    </ul>
  );
}
